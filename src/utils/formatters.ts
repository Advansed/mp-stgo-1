// src/utils/formatters.ts

/**
 * Превращает любой формат адреса (объект, строка, null) в чистую строку для UI.
 * Решает проблему [object Object].
 */
export const normalizeAddress = (addr: any): string => {
    if (!addr) return '';

    if (typeof addr === 'string') return addr.replace(/,\s*$/, '').trim();

    if (Array.isArray(addr) && addr.length > 0) {
        return normalizeAddress(addr[0]);
    }

    if (typeof addr === 'object') {
        if (addr.address && typeof addr.address === 'string') return addr.address;
        if (addr.value && typeof addr.value === 'string') return addr.value;
        if (addr.text && typeof addr.text === 'string') return String(addr.text);
        if (addr.address_go) return String(addr.address_go);
        if (addr.full) return String(addr.full);
        if (addr.name && typeof addr.name === 'string') return addr.name;
        if (addr.description && typeof addr.description === 'string') return addr.description;

        const parts: string[] = [];
        if (addr.city) parts.push(String(addr.city));
        if (addr.settlement) parts.push(String(addr.settlement));
        if (addr.street) parts.push(String(addr.street));
        if (addr.house) parts.push(addr.street ? `д. ${addr.house}` : String(addr.house));
        if (addr.flat || addr.apartment) parts.push(`кв. ${addr.flat || addr.apartment}`);
        if (parts.length) return parts.join(', ');
    }

    return '';
};

/**
 * Нормализует ФИО или название клиента.
 */
export const normalizeFio = (client: any): string => {
    if (!client) return '';
    
    // Если строка
    if (typeof client === 'string') return client;
    
    // Если объект
    if (client?.name) return client.name;
    if (client?.fio) return client.fio;
    if (client?.client_name) return client.client_name;
    if (client?.label) return client.label;
    if (client?.value) return client.value;

    return '';
};