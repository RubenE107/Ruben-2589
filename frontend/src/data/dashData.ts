
const nombreCarac= ['Rayo', 'Trueno', 'Relámpago', 'Burbuja', 'Chispa', 'Turbo'];

export interface SnailData {
    name: string;
    victorias: number;
}

export function simulaDatos(): SnailData[] {
    const result: SnailData[] = nombreCarac.map((name) => ({name, victorias: 0}));
    for (let i = 0; i < 6; i++) {
        const ganadorIndex = Math.floor(Math.random() *6);
        result[ganadorIndex].victorias+=1;
    }
    return result;
}
export const snailsData: SnailData[] = simulaDatos();

export const simulaBetsData = () => {
    const ganadas = Math.floor(Math.random() * 20);
    const perdidas = Math.floor(Math.random() * 20);
    return [
        { name: 'Ganadas', value: ganadas, fill: '#4caf50' },
        { name: 'Perdidas', value: perdidas, fill: '#f44336' },
    ];
}

export const betsData = simulaBetsData();
export const snailsData2 = simulaDatos();