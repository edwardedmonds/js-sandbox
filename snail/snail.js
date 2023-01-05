function snail() {
  let depth = 8;

  // let days = 0;
  // let climb = 0;
  // while (climb <= depth) {
  //     days += 1;
  //     climb += 7;
  //     if (climb >= depth) {
  //         break;
  //     }
  //     climb -= 2;
  // }
  // console.log(days);

  let days = 0;
  for (let climb = 0; climb <= depth;) {
    days += 1;
    climb += 7;
    if (climb >= depth) {
      break;
    }
    climb -= 2;
  }
  console.log(days);
}

snail();