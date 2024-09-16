declare namespace YT {
    interface Player {
        new(element: HTMLElement, options: PlayerOptions, callback: (event: PlayerEvent) => void): Player;
        playVideo(): void;
        pauseVideo(): void;
        stopVideo(): void;
        mute(): void;
        unMute(): void;
        getPlayerState(): number;
        setVolume(volume: number): void;
        getVolume(): number;
        getDuration(): number;
        getCurrentTime(): number;
        seekTo(seconds: number): void;
    }

    interface PlayerOptions {
        height?: string;
        width?: string;
        videoId: string;
        playerVars?: any;
        events?: any;
    }

    interface PlayerEvent {
        data: number;
    }
}
