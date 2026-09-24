import type { Invoice } from './types';

export const normalizeInvoice = (inv: any): Invoice => {
    // 1. АДРЕС (Смотрим types (1).ts -> Address { address, lat, lon })
    // Если пришел объект Address, берем из него поле .address
    const rawAddr = inv.address || "";
    let addrText = "";
    let addrObj = { address: "", lat: 0, lon: 0 };

    if (typeof rawAddr === 'object' && rawAddr !== null) {
        // Это соответствует интерфейсу Address из твоего файла
        addrText = rawAddr.address || ""; 
        addrObj = rawAddr;
    } else {
        addrText = String(rawAddr || "");
        addrObj = { address: addrText, lat: 0, lon: 0 };
    }

    // 2. ФИО (Смотрим types (1).ts -> поле applicant)
    const clientName = inv.applicant || inv.Applicant || inv.owner_name || inv.ownerName || "Не указан";

    // 3. Лицевой счёт (на разных бэках может называться по-разному)
    const pickLikelyLic = () => {
        const candidates = [
            inv.lic,
            inv.personal_account,
            inv.personalAccount,
            inv.ls,
            inv.account,
            inv.code,
            inv.lic_number,
            inv.licNumber,
        ];

        for (const c of candidates) {
            const s = String(c ?? "").trim();
            // Обычно Л/С — это цифры (6+), если нашли — берём
            if (/^\d{5,}$/.test(s)) return s;
        }

        // fallback — как пришло
        return String(inv.lic || "").trim();
    };

    return {
        ...inv,
        id: String(inv.id || Math.random().toString()),
        
        // Нормализованные поля
        address: addrObj,         
        addressText: addrText,
        
        lic: pickLikelyLic(),

        // Записываем applicant в client_name для унификации
        client_name: clientName,

        phone: String(inv.phone || "").trim(),
        status: String(inv.status || "В работе"),
        number: String(inv.number || "").trim(),
        date: inv.date || "",
        service: String(inv.service || "").trim(),
        
        // Для совместимости с твоим кодом
        applicant: clientName,

        // Для актов (чтобы не плясать с разными названиями)
        owner_name: clientName,
        owner_phone: String(inv.phone || inv.owner_phone || "").trim(),
        object_address: addrText,
    };
};