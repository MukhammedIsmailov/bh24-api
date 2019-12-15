import {Interface} from "readline";

export interface IStatisticsForPlotRequest {
    startDate: string;
    endDate: string;
}

export interface IStatisticsForPlotResponse {
    startTime: number;
    endTime: number;
    landingVisitCount: number;
    courseSubscriptionCount: number;
    courseFinishedCount: number;
    feedbackButtonClickCount: number;
}

interface IPointsDatasetData {
    data: number[];
}

export interface IPlotData {
    labels: string[];
    dataset: IPointsDatasetData[];
}