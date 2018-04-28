
/**
 * Order of events:
 * RoundStart
 *     SpinStart
 *         PlayRequestSuccess | PlayRequestError
 *         SpinEndReady
 *     SpinEnd
 *     ResultsStart
 *         TotalWinStart
 *         TotalWinEnd
 *         WinsStart
 *             WinStart
 *             WinEnd
 *         WinsEnd
 *         FeatureStart
 *         FeatureEnd
 *     ResultsEnd
 * RoundEnd
 */
export enum ApplicationEvent {
    RoundStart = 'ApplicationEvent.RoundStart',
    RoundEnd = 'ApplicationEvent.RoundEnd',
    SpinStart = 'ApplicationEvent.SpinStart',
    SpinEnd = 'ApplicationEvent.SpinEnd',
    Slam = 'ApplicationEvent.Slam',
    ResultsStart = 'ApplicationEvent.ResultsStart',
    ResultsEnd = 'ApplicationEvent.ResultsEnd',
    SkipResults = 'ApplicationEvent.SkipResults',
    PlayRequestSuccess = 'ApplicationEvent.PlayRequestSuccess',
    PlayRequestError = 'ApplicationEvent.PlayRequestError', 
    SpinEndReady = 'ApplicationEvent.SpinEndReady',
    WinsStart = 'ApplicationEvent.WinsStart',
    WinsEnd = 'ApplicationEvent.WinsEnd',
    TotalWinStart = 'ApplicationEvent.TotalWinStart',
    TotalWinEnd = 'ApplicationEvent.TotalWinEnd',
    WinStart = 'ApplicationEvent.WinStart',
    WinEnd = 'ApplicationEvent.WinEnd',
    FeatureStart = 'ApplicationEvent.FeatureStart',
    FeatureEnd = 'ApplicationEvent.FeatureEnd',
}