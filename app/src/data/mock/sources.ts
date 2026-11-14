// Shared sources. Entries with placeholder: true wait for docs/build/*.md.
import type { Source } from '../types';

export const S = {
  ng12: { label: 'NICE NG12 (paraphrased)', url: 'https://www.nice.org.uk/guidance/ng12', placeholder: true },
  kaypaLung: { label: 'Käypä hoito: lung cancer', url: 'https://www.kaypahoito.fi/', placeholder: true },
  kaypaColorectal: { label: 'Käypä hoito: colorectal cancer', url: 'https://www.kaypahoito.fi/', placeholder: true },
  registryStats: { label: 'Finnish Cancer Registry statistics', url: 'https://syoparekisteri.fi/tilastot/', placeholder: true },
  uicc8: { label: 'UICC TNM 8th edition', url: 'https://www.uicc.org/resources/tnm', placeholder: true },
  yleKuittinen: { label: 'Yle MOT on the Kuittinen study (unpublished)', url: 'https://yle.fi/a/74-20251023' },
  registry2024: {
    label: 'Cancer Registry 2024 factsheet',
    url: 'https://syoparekisteri.fi/assets/themes/ssy3/factsheets/syopa_2024_tilastoraportti.html',
  },
  registryLung: {
    label: 'Cancer Registry: Keuhkosyöpä Suomessa (2024)',
    url: 'https://syoparekisteri.fi/assets/files/2024/12/Keuhkosyopa_Suomessa.pdf',
  },
  registryNotifications: {
    label: 'Cancer Registry article, 26 Jun 2025',
    url: 'https://syoparekisteri.fi/2025/06/26/yhteistyo-toi-parannusta-syoparekisteri-ilmoituksiin/',
  },
  stm2010: {
    label: 'STM 2010:6 cancer care guidance (unverified)',
    url: 'https://www.iccp-portal.org/system/files/plans/selv_2010_6_syovan_hoito_verkko.pdf',
    placeholder: true,
  },
  leedsDart: { label: 'Leeds DART study (PMC5697536)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5697536' },
  strategy: {
    label: 'National cancer strategy 2026–2035',
    url: 'https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf',
  },
  nciLungTnm: {
    label: 'NCI lung cancer treatment summary (TNM categories)',
    url: 'https://www.cancer.gov/types/lung/hp/non-small-cell-lung-treatment-pdq',
  },
  nciColonTnm: {
    label: 'NCI colon cancer treatment summary (TNM categories)',
    url: 'https://www.cancer.gov/types/colorectal/hp/colon-treatment-pdq',
  },
  registryNotification: { label: 'Cancer Registry notification page (form fields)', url: 'https://syoparekisteri.fi/ilmoituspalvelu/' },
  registryDraftFields: {
    label: 'Cancer Registry clinical model v1.1 (not readable; draft fields)',
    url: 'https://syoparekisteri.fi/ilmoituspalvelu/',
    placeholder: true,
  },
  registryOldBasisCodes: {
    label: 'Medical Data Models: older registry basis-of-diagnosis form (outdated)',
    url: 'https://medical-data-models.org/4072?lang=en',
    placeholder: true,
  },
  ng12Sites: {
    label: 'NICE NG12 recommendations by site of cancer',
    url: 'https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer',
  },
  johansson2024: {
    label: 'Johansson et al., Acta Oncologica 2024, Table 2',
    short: 'Johansson 2024, Table 2',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11332520/',
  },
  kysReferral: {
    label: 'KYS referral instruction (Syöpäkeskus v1, 17.12.2024)',
    url: 'https://pshyvinvointialue.fi/documents/594193/718131/L%C3%A4hete+KYSin+Sy%C3%B6p%C3%A4keskuksen+poliklinikalle+(1).pdf',
  },
  ng12Bradford: {
    label: 'NICE NG12 via Bradford VTS aid (secondary copy)',
    url: 'https://www.bradfordvts.co.uk/wp-content/onlineresources/clinical-knowledge/palliative-care/2ww%20Referral%20Criteria%20for%20the%20Different%20Cancers.pdf',
  },
  satakunta: {
    label: 'Satakunnan Kansa, 11.11.2026 (lung CT route, news)',
    url: 'https://www.satakunnankansa.fi/satakunta/art-2000012403607.html',
  },
  nordicLungClinEpi: {
    label: 'Clin Epidemiol 2023, lung cancer survival in the Nordic countries (Table 2b)',
    short: 'Clin Epidemiol 2023, Table 2b',
    url: 'https://dovepress.com/survival-in-lung-cancer-in-the-nordic-countries-through-a-half-century-peer-reviewed-fulltext-article-CLEP',
  },
  sotkanetColon: {
    label: 'THL Sotkanet indicator 3627 (colon cancer, Finland, 2024)',
    short: 'THL Sotkanet 3627',
    url: 'https://sotkanet.fi/rest/1.1/json?indicator=3627&genders=total&years=2024&region=658',
  },
  kuitunen2026: {
    label: 'Kuitunen et al., Cancer Medicine 2026 (lymphoma routes)',
    url: 'https://doi.org/10.1002/cam4.71920',
  },
  gpnotebookOvarian: {
    label: 'NICE NG12 ovarian, via GPnotebook (secondary copy)',
    url: 'https://gpnotebook.com/en-GB/pages/general-practice/urgent-referral-for-suspected-ovarian-cancer',
  },
  crukNg12Poster: {
    label: 'CRUK NG12 poster (secondary copy)',
    url: 'https://publications.cancerresearchuk.org/cdn/shop/files/NICE_NG12_body_poster.pdf',
  },
  kaypaHereditary: {
    label: 'Käypä hoito: hereditary breast and ovarian cancer (22.9.2025)',
    url: 'https://www.kaypahoito.fi/nix03573',
  },
  figo2014: {
    label: 'FIGO 2014 ovarian staging, Prat, Int J Gynaecol Obstet 2014 (read via a summary, unverified)',
    url: 'https://doi.org/10.1016/j.ijgo.2013.10.001',
  },
  hemminki2024: {
    label: 'Hemminki et al., Cancers 2024, Supplementary Table S3 (NORDCAN data)',
    short: 'Hemminki 2024, Table S3',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11201377',
  },
} satisfies Record<string, Source>;
