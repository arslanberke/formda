// 3D hareket animasyonları: Vital Animations ücretsiz paketi (vitalanimations.com/free-pack),
// arka planı kaldırılıp animasyonlu WebP'ye çevrildi (scripts/build-moves.py).
export const MOVES: Record<string, number> = {
  goblet_squat: require('../../assets/moves/goblet_squat.webp'),
  kb_goblet_squat: require('../../assets/moves/goblet_squat.webp'),
  bb_squat: require('../../assets/moves/bb_squat.webp'),
  db_rdl: require('../../assets/moves/db_rdl.webp'),
  bb_rdl: require('../../assets/moves/bb_rdl.webp'),
  kb_swing: require('../../assets/moves/kb_swing.webp'),
  step_up: require('../../assets/moves/step_up.webp'),
  db_shoulder_press: require('../../assets/moves/db_shoulder_press.webp'),
  bb_ohp: require('../../assets/moves/bb_ohp.webp'),
  db_lateral_raise: require('../../assets/moves/db_lateral_raise.webp'),
  treadmill_walk: require('../../assets/moves/treadmill_walk.webp'),
  treadmill_run: require('../../assets/moves/treadmill_run.webp'),
  bike_steady: require('../../assets/moves/bike_steady.webp'),
}
export const hasMove = (id: string) => id in MOVES
