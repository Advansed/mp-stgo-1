export const COMMON_STYLE = `
  <style>
    @page { size: A4; margin: 1.5cm; }
    body { font-family: Times New Roman, serif; font-size: 14pt; }
    .header { text-align: center; font-weight: bold; }
    .act-title { text-align: center; font-weight: bold; margin-top: 20px; }
    .act-meta { margin-top: 10px; }
    .section { margin-top: 15px; }
    .signature { margin-top: 30px; display: flex; justify-content: space-between; }
    .signature div { width: 45%; }
  </style>
`;

export const COMMON_HEADER = `
  <div class="header">
    <img src="{{LOGO_SRC}}" style="height: 60px;" /><br/>
    АО "Сахатранснефтегаз"<br/>
    Структурное подразделение<br/>
    Управление газораспределительных сетей
  </div>
`;
