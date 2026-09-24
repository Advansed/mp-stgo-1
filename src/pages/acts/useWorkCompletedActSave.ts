import { useCallback, useState } from 'react';
import type { RefObject } from 'react';
import { useActsStore } from '../../store/actsStore';
import type { Act } from '../../domain/types';
import {
  buildWorkCompletedSavePayload,
  type WorkCompletedActMeta,
} from './workCompletedAct';
import type { WorkCompletedFormHandle } from './WorkCompleted';

interface UseWorkCompletedActSaveOptions {
  token: string | null;
  meta: WorkCompletedActMeta | null;
  formRef: RefObject<WorkCompletedFormHandle | null>;
  onSaved?: (savedAct: Act) => void;
}

export function useWorkCompletedActSave({
  token,
  meta,
  formRef,
  onSaved,
}: UseWorkCompletedActSaveOptions) {
  const saveAct = useActsStore((s) => s.saveAct);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const save = useCallback(async () => {
    if (!token) {
      setError('Нет авторизации');
      return null;
    }
    if (!meta?.act_number) {
      setError('Не найден черновик акта (нет номера). Обновите страницу.');
      return null;
    }

    const handle = formRef.current;
    if (!handle) {
      setError('Форма не готова');
      return null;
    }

    const validation = handle.validate();
    if (!validation.ok) {
      setError(validation.message || 'Заполните обязательные поля');
      return null;
    }

    const formData = handle.getFormData();
    const payload = buildWorkCompletedSavePayload(formData, meta);

    setSaving(true);
    setError(null);

    try {
      const savedAct = await saveAct(token, payload);
      onSaved?.(savedAct);
      return savedAct;
    } catch (e: any) {
      setError(e?.message || 'Не удалось сохранить акт');
      return null;
    } finally {
      setSaving(false);
    }
  }, [token, meta, formRef, saveAct, onSaved]);

  return { save, saving, error, clearError };
}
