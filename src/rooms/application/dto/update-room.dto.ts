export interface UpdateRoomDto {
  roomCode?: string;
  name?: string;
  courseId?: number | null;
  capacity?: number;
  building?: number;
  floor?: number;
}
