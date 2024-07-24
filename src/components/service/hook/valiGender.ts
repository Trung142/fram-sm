export function getGenderCode(gender: string | undefined): number {
    if (gender === 'Nam') {
      return 1;
    } else if (gender === 'Nữ') {
      return 2;
    } else {
      return 0;
    }
}

export function getGenderFromNumToFrom(gender: number | undefined): string {
  if (gender === 1) {
    return 'Nam';
  } else if (gender === 2) {
    return 'Nữ';
  } else {
    return 'Tất cả';
  }
}