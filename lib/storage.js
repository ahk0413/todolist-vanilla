//  localStorage는 문자열만 저장 가능
const TODOS_LS = 'todoListArray';

export let todoListArray = [];

/* 초기 데이터 불러오기 */
export function getStorage() {
  //getItem() : 로컬스토리지에서 해당 키값의 데이터값을 가져옴
  const loadedToDos = localStorage.getItem(TODOS_LS);

  // 데이터가 없거나 null 값인 경우 데이터를 초기화하여 반환
  if (!loadedToDos || loadedToDos === "undefined") {
    todoListArray.length = 0;
    return;
  }

  // try, catch 쓰는 이유 : 프로그램이 중단되지 않도록 함
  // try() : 에러가 날 수 있는 함수를 적어놓음
  try {
    // 문자열을 배열 객체로 변환
    const parsedToDos = JSON.parse(loadedToDos);
    todoListArray.length = 0;
    todoListArray.push(...parsedToDos);
    // catch() : 에러날 시 여기로 이동
  } catch (error) {
    console.error("JSON 파싱 오류:", error);
    localStorage.removeItem(TODOS_LS);
    todoListArray.length = 0;
  }
}

/* 배열 상태를 저장 */
export function setStorage() {
  if (!Array.isArray(todoListArray)) {
    return;
  }
  // setItem() : localStorage나 sessionStorage에 데이터를 저장할 때 사용

  //JSON.stringify() : javaScript 객체나 배열을 문자열(String) 형태로 변환
  localStorage.setItem(TODOS_LS, JSON.stringify(todoListArray));
}
