"""Scoring rules for ml/eval.py, tested through its pure functions (no network).

Expected behaviour comes from ml/CONTRACT.md and the SPEC Seam 2 note, not from the implementation.
Run: uv run --with requests --with jsonschema --with pytest python -m pytest ml/tests/test_eval_scoring.py -q
"""
import copy
import importlib.util
import json
from pathlib import Path

import pytest

ML_DIR = Path(__file__).resolve().parents[1]
_spec = importlib.util.spec_from_file_location("vitruvian_eval", ML_DIR / "eval.py")
ev = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(ev)

FIXTURE = ML_DIR / "tests" / "fixtures" / "eval_sample.jsonl"
ENUM_SEX = {"type": "string", "enum": ["female", "male", "other", "unknown"]}


def fixture_records():
    return ev.load_records(FIXTURE, None)


def lung_record():
    return next(r for r in fixture_records() if r["cancer"] == "lung")


# ---- text and comparison rules

def test_normalise_folds_case_diacritics_punctuation_and_spaces():
    assert ev.normalise_text("  Päivää,   COUGH!  ") == ev.normalise_text("paivaa cough")


def test_normalise_turns_hyphen_into_space():
    assert ev.normalise_text("chest-pain") == ev.normalise_text("chest pain")


def test_enum_match_is_exact_and_case_sensitive():
    assert ev.values_match("sex", ENUM_SEX, "male", "male")
    assert not ev.values_match("sex", ENUM_SEX, "male", "Male")


def test_boolean_is_not_equal_to_integer_one():
    prop = {"type": "boolean"}
    assert ev.values_match("haemoptysis", prop, True, True)
    assert not ev.values_match("haemoptysis", prop, True, 1)


def test_integer_and_number_compare_by_value_not_string():
    assert ev.values_match("age", {"type": "integer"}, 62, 62.0)
    assert not ev.values_match("age", {"type": "integer"}, 62, "62")


def test_free_text_is_normalised():
    prop = {"type": "string", "minLength": 1}
    assert ev.values_match("mainSymptom", prop, "Cough.", "cough")
    assert not ev.values_match("mainSymptom", prop, "cough", "fever")


def test_ids_and_dates_are_exact_not_normalised():
    id_prop = {"type": "string", "pattern": "^SYN-[0-9]{3}$"}
    assert ev.values_match("patientId", id_prop, "SYN-101", "SYN-101")
    assert not ev.values_match("patientId", id_prop, "SYN-101", "syn-101")
    date_prop = {"type": "string", "format": "date"}
    assert not ev.values_match("referralDate", date_prop, "2026-11-14", "2026-11-15")


def test_text_array_is_an_unordered_normalised_set():
    prop = {"type": "array", "items": {"type": "string"}}
    assert ev.values_match("currentMedicines", prop, ["Aspirin", "Ramipril"], ["ramipril", "aspirin."])
    assert not ev.values_match("currentMedicines", prop, ["Aspirin"], ["Aspirin", "Ramipril"])


def test_enum_array_is_exact():
    prop = {"type": "array", "items": {"type": "string", "enum": ["weight_loss", "cough"]}}
    assert ev.values_match("lungSymptoms", prop, ["weight_loss"], ["weight_loss"])
    assert not ev.values_match("lungSymptoms", prop, ["weight_loss"], ["weight loss"])


def test_tests_done_compares_name_and_result_and_ignores_date():
    prop = {"type": "array"}
    target = [{"name": "Chest X-ray", "date": "2026-11-14", "result": "Abnormal"}]
    assert ev.values_match("testsDone", prop, target, [{"name": "chest x-ray", "result": "abnormal"}])
    assert not ev.values_match("testsDone", prop, target, [{"name": "chest x-ray", "result": "normal"}])


def test_null_is_unknown_and_matches_only_null():
    prop = {"type": "string", "minLength": 1}
    assert ev.values_match("gpQuestion", prop, None, None)
    assert not ev.values_match("gpQuestion", prop, None, "something")
    assert not ev.values_match("gpQuestion", prop, "something", None)


def test_object_compares_each_key_with_its_schema():
    prop = {"type": ["object", "null"], "properties": {"type": {"type": "string"}, "yearDiagnosed": {"type": "integer"}}}
    assert ev.values_match("priorCancer", prop, {"type": "Breast", "yearDiagnosed": 2015}, {"type": "breast", "yearDiagnosed": 2015})
    assert not ev.values_match("priorCancer", prop, {"type": "Breast", "yearDiagnosed": 2015}, {"type": "Breast", "yearDiagnosed": 2016})


# ---- per-record field scoring

def test_optional_field_absent_on_both_sides_counts_correct():
    rec = lung_record()
    fields = copy.deepcopy(rec["target"]["fields"])
    assert "asbestosExposure" not in fields
    scores = ev.score_fields("lung", fields, copy.deepcopy(fields))
    assert scores["asbestosExposure"] == {"correct": True, "present": False}


def test_extra_predicted_optional_field_counts_wrong():
    rec = lung_record()
    predicted = copy.deepcopy(rec["target"]["fields"])
    predicted["asbestosExposure"] = True
    scores = ev.score_fields("lung", rec["target"]["fields"], predicted)
    assert scores["asbestosExposure"]["correct"] is False


def test_missing_target_field_counts_wrong():
    rec = lung_record()
    predicted = copy.deepcopy(rec["target"]["fields"])
    del predicted["haemoptysis"]
    assert ev.score_fields("lung", rec["target"]["fields"], predicted)["haemoptysis"]["correct"] is False


def test_perfect_reply_is_fully_correct_and_perturbed_is_not():
    rec = lung_record()
    perfect = ev.evaluate_reply(rec, json.dumps(ev.target_reply(rec)))
    assert all(s["correct"] for s in perfect["field_scores"].values())
    perturbed = ev.evaluate_reply(rec, ev.perturbed_caller(rec, [])[0])
    assert not all(s["correct"] for s in perturbed["field_scores"].values())


# ---- schema validation

def test_required_null_is_unknown_not_a_schema_failure():
    rec = lung_record()
    fields = copy.deepcopy(rec["target"]["fields"])
    fields["urgency"] = None
    assert ev.schema_errors("lung", fields) == []
    scores = ev.score_fields("lung", rec["target"]["fields"], fields)
    assert scores["urgency"]["correct"] is False


def test_missing_required_field_is_a_schema_failure():
    fields = copy.deepcopy(lung_record()["target"]["fields"])
    del fields["age"]
    assert ev.schema_errors("lung", fields)


def test_unknown_field_is_a_schema_failure():
    fields = copy.deepcopy(lung_record()["target"]["fields"])
    fields["bogus"] = 1
    assert ev.schema_errors("lung", fields)


def test_conditional_rule_is_enforced():
    fields = copy.deepcopy(lung_record()["target"]["fields"])
    del fields["chestXrayFindings"]  # chestXrayResult is abnormal, so findings are required
    assert ev.schema_errors("lung", fields)


# ---- evidence and parsing

def test_evidence_must_be_exact_substring_of_a_note():
    notes = ["Cough for 6 weeks, third visit."]
    assert ev.evidence_grounding({"a": "Cough for 6 weeks"}, notes) == (1, 1)
    assert ev.evidence_grounding({"a": "cough for 6 weeks"}, notes) == (0, 1)
    assert ev.evidence_grounding({"a": ""}, notes) == (0, 1)


def test_fenced_reply_is_a_format_miss_but_still_parses():
    parsed, fenced, problem = ev.parse_reply('```json\n{"fields": {}, "evidence": {}}\n```')
    assert fenced and parsed is not None and problem == ""


def test_prose_or_missing_fields_object_is_invalid():
    assert ev.parse_reply("Here you go: {}")[0] is None
    assert ev.parse_reply('{"evidence": {}}')[0] is None


def test_invalid_json_scores_every_field_wrong():
    rec = lung_record()
    result = ev.evaluate_reply(rec, "not json at all")
    assert result["json_valid"] is False and result["schema_valid"] is False
    assert not any(s["correct"] for s in result["field_scores"].values())


def test_evidence_grounding_is_reported_per_record():
    rec = lung_record()
    reply = {"fields": copy.deepcopy(rec["target"]["fields"]), "evidence": {"mainSymptom": "Not in the notes"}}
    result = ev.evaluate_reply(rec, json.dumps(reply))
    assert (result["evidence_grounded"], result["evidence_total"]) == (0, 1)


# ---- data and aggregation

@pytest.mark.parametrize("record", fixture_records(), ids=lambda r: r["id"])
def test_fixture_records_pass_data_qc(record):
    assert ev.check_record(record) == []


def test_summary_splits_by_cancer_language_and_kind():
    results = ev.run_eval(fixture_records(), ev.dry_run_caller, concurrency=2)
    summary = ev.summarise(results)
    assert summary["overall"]["field_accuracy"] == 1.0
    assert set(summary["per_cancer"]) == {"lung", "colorectal", "ovarian"}
    assert set(summary["per_language"]) == {"en", "fi"}
    assert summary["per_kind"]["control"]["records"] == 1


def test_refuses_train_split_records(tmp_path):
    bad = dict(fixture_records()[0], split="train")
    path = tmp_path / "bad.jsonl"
    path.write_text(json.dumps(bad) + "\n", encoding="utf-8")
    with pytest.raises(SystemExit):
        ev.load_records(path, None)
