const LOADERS: Record<string, () => Promise<string>> = {
  actbr: () => import('./htmlBr').then((m) => m.HTML_BR),
  actplomb: () => import('./htmlPlomb').then((m) => m.HTML_PLOMB),
  actda: () => import('./htmlDa').then((m) => m.HTML_DA),
  actmrr: () => import('./htmlMrr').then((m) => m.HTML_MRR),
  actmi: () => import('./htmlMi').then((m) => m.HTML_MI),
  actdo: () => import('./htmlDo').then((m) => m.HTML_DO),
  predp: () => import('./htmlPredp').then((m) => m.HTML_PREDP),
  actaad: () => import('./htmlAad').then((m) => m.HTML_AAD),
  actmr: () => import('./htmlMr').then((m) => m.HTML_MR),
  actsf: () => import('./htmlSf').then((m) => m.HTML_SF),
  actsge: () => import('./htmlSge').then((m) => m.HTML_SGE),
  work_completed: () => import('./htmlWc').then((m) => m.HTML_WC),
  work_completed_to: () => import('./htmlWcTo').then((m) => m.HTML_WC_TO),
};

export async function loadActHtmlTemplate(type: string): Promise<string> {
  const load = LOADERS[type];
  if (!load) {
    throw new Error(`Unknown act template: ${type}`);
  }
  return load();
}
