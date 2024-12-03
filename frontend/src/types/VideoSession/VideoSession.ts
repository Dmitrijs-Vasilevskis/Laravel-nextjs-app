export interface InitVideoSessionParams {
    host_id: number;
    video_id: string;
}

export interface DeleteVideoSessionParams {
    session_id: string;
    host_id: number;
}

export interface GetActiveVideoSessionParams {
    host_id: number;
    status: string;
}

export interface VideoSessionInterface {
    id: number;
    host_id: number;
    video_id: string;
    token: string;
    session_id: string;
    is_public: boolean;
    is_active: boolean;
}