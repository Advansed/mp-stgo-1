// src/domain/normalizers.ts

export const normalizeInvoice = (inv: any) => {
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
    // 🔥 ВОТ ОНО: БЕРЕМ APPLICANT
    const clientName = inv.applicant || inv.Applicant || "Не указан";

    return {
        ...inv,
        id: String(inv.id || Math.random().toString()),
        
        // Нормализованные поля
        address: addrObj,         
        addressText: addrText,
        
        lic: String(inv.lic || "").trim(),

        // 🔥 Записываем applicant в client_name для унификации
        client_name: clientName,

        phone: String(inv.phone || "").trim(),
        status: String(inv.status || "В работе"),
        number: String(inv.number || "").trim(),
        date: inv.date || "",
        service: String(inv.service || "").trim(),
        
        // Для совместимости с твоим кодом
        applicant: clientName 
    };
};