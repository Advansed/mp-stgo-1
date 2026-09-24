import { useEffect, useState } from 'react';
import type { Act, Invoice } from '../../domain/types';
import { useLicsStore } from '../../store/licsStore';
import {
  buildWorkCompletedInitialValues,
  enrichWorkCompletedFromLic,
  findLicByCode,
  shouldEnrichWorkCompletedFromLic,
  type WorkCompletedFormData,
} from './workCompletedAct';

interface UseWorkCompletedInitialValuesOptions {
  enabled?: boolean;
  token: string | null | undefined;
  draft: Act | null | undefined;
  invoice: Invoice | null | undefined;
}

export function useWorkCompletedInitialValues({
  enabled = true,
  token,
  draft,
  invoice,
}: UseWorkCompletedInitialValuesOptions) {
  const fetchLics = useLicsStore((s) => s.fetchLics);
  const addLicToUser = useLicsStore((s) => s.addLicToUser);

  const [initialValues, setInitialValues] = useState<Partial<WorkCompletedFormData>>({});
  const [loading, setLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) {
      setInitialValues({});
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      const base = buildWorkCompletedInitialValues({ draft, invoice });

      if (!shouldEnrichWorkCompletedFromLic(draft)) {
        if (!cancelled) {
          setInitialValues(base);
          setLoading(false);
        }
        return;
      }

      const licCode = String(base.personalAccount || '').trim();
      if (!licCode || !token) {
        if (!cancelled) {
          setInitialValues(base);
          setLoading(false);
        }
        return;
      }

      try {
        let list = useLicsStore.getState().list;
        let licObj = findLicByCode(list, licCode);

        if (!licObj) {
          await fetchLics(token);
          list = useLicsStore.getState().list;
          licObj = findLicByCode(list, licCode);
        }

        if (!licObj) {
          await addLicToUser(token, {
            code: licCode,
            account: licCode,
            lic: licCode,
            fio: base.subscriberFullname,
            name: base.subscriberFullname,
            address: base.address,
            address_go: base.address,
          });
          list = useLicsStore.getState().list;
          licObj = findLicByCode(list, licCode);
        }

        const enriched = licObj ? enrichWorkCompletedFromLic(base, licObj) : base;
        if (!cancelled) {
          setInitialValues(enriched);
          setLoading(false);
        }
      } catch (e) {
        console.error('Failed to resolve lic for work completed act', e);
        if (!cancelled) {
          setInitialValues(base);
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, token, draft?.id, draft?.details, draft?.act_number, invoice?.id, invoice?.lic, fetchLics, addLicToUser]);

  return { initialValues, loading };
}
