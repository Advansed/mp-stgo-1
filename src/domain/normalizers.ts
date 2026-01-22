// src/domain/normalizers.ts

export const normalizeInvoice = (inv: any) => {
    // 1. Безопасно извлекаем адрес (всегда строка)
    const rawAddr = inv.address || inv.Адрес || "";
    const addrText = typeof rawAddr === 'object' ? (rawAddr.address || "") : String(rawAddr || "");
    
    // 2. Сохраняем объект для карты (если есть)
    const addrObj = typeof rawAddr === 'object' ? rawAddr : { address: addrText, lat: 0, lon: 0 };

    return {
        ...inv,
        id: inv.id || inv.Ссылка || Math.random().toString(), // Гарантируем ID
        
        // 🔥 ДВА ПОЛЯ: одно для UI (строка), другое для карт (объект)
        address: addrObj,         
        addressText: addrText,    // Используй это поле в JSX!
        
        status: String(inv.status || inv.Статус || "В работе"),
        number: String(inv.number || inv.Номер || "").trim(),
        date: inv.date || inv.Дата || "",
        phone: String(inv.phone || inv.Телефон || ""),
        
        // Для совместимости, если где-то проскочит
        Адрес: addrText 
    };
};