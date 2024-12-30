export function formatToTimeAgo(date: string): string {
  // getTime() : Unix Epoch(1970.1.1 자정이후의 밀리초)
  const dayInMs = 1000 * 60 * 60 * 24; // 1day를 밀리초로 치환한 값
  const time = new Date(date).getTime();
  const now = new Date().getTime();
  const diff = Math.round((time - now) / dayInMs); // 날짜를 소수점으로 만들지 않기 위해서

  const formatter = new Intl.RelativeTimeFormat("ko");
  return formatter.format(diff, "days");
}

export function formatToWon(price: number): string {
  return price.toLocaleString("ko-KR");
}
