import { IPlotData } from  './DTO/IStatisticsForPlot';
import { statisticsConfig } from './statistics.config';

interface IDataFromDB {
    date: string;
    count: string;
}

export function plotDataGenerate(dataFromDB: IDataFromDB[][], eventTypes) {
    const plotData: IPlotData = {
        dataset: [],
        labels: []
    };

    plotData.labels = dataFromDB[0].map(item => {
        return item.date;
    });

    plotData.dataset = dataFromDB.map((dataItems, index) => {
        const eventType = eventTypes[index];
        return {
            ...statisticsConfig[eventType],
            data: dataItems.map(item => { return parseInt(item.count); })
        };
    });

    plotData.dataset.splice(6, 1);

    return plotData;
}