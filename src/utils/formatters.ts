// src/utils/formatters.ts

/**
 * Превращает любой формат адреса (объект, строка, null) в чистую строку для UI.
 * Решает проблему [object Object].
 */
export const normalizeAddress = (addr: any): string => {
    if (!addr) return '';
    
    // 1. Если это уже строка — возвращаем как есть
    if (typeof addr === 'string') return addr;
    
    // 2. Проверяем структуру как в InvoicePrintForm / 1C (поле .address)
    if (addr?.address && typeof addr.address === 'string') return addr.address;
    
    // 3. Проверяем структуру DaData (поле .value)
    if (addr?.value && typeof addr.value === 'string') return addr.value;
    
    // 4. Проверяем просто поле .text (иногда бывает)
    if (addr?.text && typeof addr.text === 'string') return addr.text;
    
    // 5. Проверяем поле .name (для гео-объектов)
    if (addr?.name && typeof addr.name === 'string') return addr.name;

    // 6. Проверяем поле .description (редкий кейс)
    if (addr?.description && typeof addr.description === 'string') return addr.description;
    
    // 7. Если это массив (бывает и такое в странных API)
    if (Array.isArray(addr) && addr.length > 0) {
        return normalizeAddress(addr[0]); // Рекурсивно пробуем первый элемент
    }

    // Если ничего не подошло, но это объект — пробуем JSON, но лучше вернуть пустоту, 
    // чтобы не пугать юзера.
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