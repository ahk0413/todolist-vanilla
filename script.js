// 배열을 참조하려면 재할당 x => 기존배열을 직접 변경 및 삭제
import { todoListArray, getStorage, setStorage } from './lib/storage.js';


const addInput = document.querySelector('#addInput');
const addBtn = document.querySelector('#addBtn');
const allDelBtn = document.querySelector('#allDelBtn');
const todoList = document.querySelector('#todoList');
const inputWrap = todoForm.getElementsByClassName("input_wrap")[0];


/* --- 추가 --- */
/* 추가할 li 돔으로 형성 */
// 보안&유지보수 측면에서는 안전한 방법: dom api로 생성
function createItem(value, id, isChecked) {
  const li = document.createElement('li');
  li.setAttribute('data-id', id);

  const label = document.createElement('label');
  label.className = 'todo_label';
  label.htmlFor = `chk_${id}`;

  const chkBox = document.createElement('input');
  chkBox.type = 'checkbox';
  chkBox.className = 'todo_chkbox';
  chkBox.id = `chk_${id}`;
  chkBox.checked = isChecked;

  const chkMark = document.createElement('span');
  chkMark.className = 'chkmark';

  const todoText = document.createElement('span');
  todoText.className = 'todo_text';
  todoText.textContent = value;
  
  // label 안에 요소로 넣음
  // append() : 요소, 텍스트, 여러개 추가가능
  label.append(chkBox, chkMark, todoText);

  const delBtn = document.createElement('button');
  delBtn.type = 'button';
  delBtn.className = 'delete_btn';

  const delBlind = document.createElement('span');
  delBlind.className = 'blind';
  delBlind.textContent = '삭제';

  //appendChild() : 요소만 추가 가능(텍스트 x), 하나만 추가
  delBtn.appendChild(delBlind);

  li.append(label, delBtn);

  return li;
}

/* todoList 안 li 추가 */
function renderItem({target, value, id, isChecked = false}) {
  const li = createItem(value, id, isChecked);
  // prepend(): DOM 요소에 자식 요소를 맨 앞에 추가
  target.prepend(li);
}

/* 추가한 값 배열에 저장 */
function addItemArray(id, value, isChecked = false) {
  //unshift() : 쓰면 로컬스토리지 저장할때 배열 순서를 바꿔주어 push로 바꿈
  todoListArray.push({ id, value, isChecked });
  setStorage();
}

/* input 에러메세지 생성 */
function createErrorMsg() {
  const errorMsg = document.createElement("div");
  errorMsg.className = "inputErrorMsg";

  const errorSvg = document.createElement('img');
  errorSvg.src = './assets/images/message-alert-circle.svg';

  const errorSpan = document.createElement('span');
  errorSpan.textContent='할 일을 입력해주세요!';

  errorMsg.append(errorSvg, errorSpan);

  if (!inputWrap.querySelector(".inputErrorMsg")) {
    inputWrap.appendChild(errorMsg);
  }
} 

/* 할일 추가 이벤트 */
function handleTodoList(e) {
  const target = todoList;
  let value = addInput.value;

  //안전하고 충돌 없는 고유 ID(=UUID v4)를 생성함 => IE 지원x
  const id = crypto.randomUUID();

  // trim() :문자열 앞뒤의 공백을 제거
  if (value.trim().length === 0) {
    createErrorMsg();
    addInput.value = '';

  } else {
    renderItem({ target, value, id });
    addItemArray(id, value, false);
    countTodo();
    const existingErrorMsg = inputWrap.querySelector(".inputErrorMsg");
    if (existingErrorMsg) existingErrorMsg.remove();
    addInput.value = '';
  }
  addInput.focus();
}

/* 키보드 엔터 이벤트 */
function handleEnterKey(e) {
  if(e.code === 'Enter' && !e.shiftKey) {
    //기본동작 차단하기 위해 (줄바꿈, 폼제출 등등)
    e.preventDefault();

    handleTodoList();
  }
}

addInput.addEventListener('keypress', handleEnterKey);
addBtn.addEventListener('click', handleTodoList);


/* --- 삭제 --- */

/* 해당 li 돔에서 제거 */
function removeItem(id) {
  const li = todoList.querySelector(`li[data-id="${id}"]`);
  if(li) {
    li.remove();
  }
}

/* 해당 아이템 배열에서도 제거 */
function removeItemArray(id) {
  //findIndex() : 조건에 맞는 첫번째 인덱스 반환 없으면 -1
  const index = todoListArray.findIndex(todo => todo.id === id);
  if (index > -1) {
    //splice() : 배열에서 요소를 제거하거나 추가
    todoListArray.splice(index, 1);
    setStorage();
  }
}

/* 삭제 버튼 이벤트 */
function handleRemove(e) {
  //closest(): css선택자와 일치하는 가장 가까운 조상요소를 찾는데 사용.
  const btn = e.target.closest('.delete_btn');
  if(!btn) return;

  const li = btn.closest('li');
  if(!li) return;

  const id = li.dataset.id;

  removeItem(id);
  removeItemArray(id);
  countTodo();
}

function handleDelClick(e) {
  if (e.target.closest('.delete_btn')) {
    handleRemove(e);
  }
}

todoList.addEventListener('click', handleDelClick);

/* 전체 삭제 */
function removeAllItem(){
  const allList = todoList.querySelectorAll('li');
  for (let i=0; i<allList.length; i++){
    allList[i].remove();
  }
}

function removeAllItemArray(){
  todoListArray.length = 0;
  setStorage();
}

function handleRemoveAll(e) {
  const li = todoList.querySelector('li');
  if(!li){
    alert('삭제할 항목이 없습니다.');
    return;
  }

  const confirmAns = confirm('할 일 목록을 전부 삭제하시겠습니까?');
  if(confirmAns){ 
    removeAllItem();
    removeAllItemArray();
    countTodo();
  }
}

allDelBtn.addEventListener('click',handleRemoveAll);
// 삭제 버튼은 동적으로 생성되기 때문에 부모에 이벤트
todoList.addEventListener('click',handleDelClick);

/* --- 해야할 일 갯수 표시 --- */

function countTodo(){
  let checkCount =  todoList.querySelectorAll('input[type="checkbox"]:checked').length;
  let allCount = todoListArray.length;
  let numCount = allCount - checkCount;

  document.querySelector('.all').textContent = allCount;
  document.querySelector('.num').textContent = numCount;
}

/* 체크할 때마다 배열 상태 변경 및 저장 */
todoList.addEventListener('change', function (e) {
  if (!e.target.matches('input[type="checkbox"]')) return;

  const li = e.target.closest('li');
  const id = li.dataset.id;
  const isChecked = e.target.checked;

  const todo = todoListArray.find(todo => todo.id === id);
  if (todo) {
    todo.isChecked = isChecked;
    setStorage();
    countTodo();
  }
});

countTodo();

/* --- 로컬스토리지 --- */
function init() {
  getStorage();

  //todoListArray에 저장된 각 할일 아이템을 화면에 그려줌
  todoListArray.forEach(function(toDo) {
    renderItem({
      target: todoList,
      value: toDo.value,
      id: toDo.id,
      isChecked: toDo.isChecked || false,
    });
  });

  countTodo();
}

init();