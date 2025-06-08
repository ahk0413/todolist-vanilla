const addInput = document.querySelector('#addInput');
const addBtn = document.querySelector('#addBtn');

const allDelBtn = document.querySelector('#allDelBtn')
const todoList = document.querySelector('#todoList');

let todoListArray = [];

/* --- 추가 --- */

/* 추가할 li 돔으로 형성 */
// 보안&유지보수 측면에서는 안전한 방법: dom api로 생성
function createItem(value, id) {
  const li = document.createElement('li');
  li.setAttribute('data-id', id);
  
  const label = document.createElement('label');
  label.className = 'todo_label';
  label.htmlFor = `chk_${id}`;

  const chkBox = document.createElement('input');
  chkBox.type = 'checkbox';
  chkBox.className = 'todo_chkbox';
  chkBox.id = `chk_${id}`;

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
function renderItem({target, value, id}) {
  const li = createItem(value, id);
  // prepend(): DOM 요소에 자식 요소를 맨 앞에 추가
  target.prepend(li);
}

/* 추가한 값 배열에 저장 */
function addItemArray(id, value) {

  //unshift() : 맨 앞에 하나 이상의 요소를 추가
  todoListArray.unshift({ id, value });
}


/* 할일 추가 이벤트 */
function handleTodoList(e) {
  const target = todoList;
  let value = addInput.value;

  //안전하고 충돌 없는 고유 ID(=UUID v4)를 생성함 => IE 지원x
  const id = crypto.randomUUID()

  // trim() :문자열 앞뒤의 공백을 제거
  if (value.trim().length === 0) {
    alert('텍스트를 입력해주세요');
    addInput.value = '';
    
  } else {
    renderItem({ target, value, id });
    addItemArray(id, value);
    
    addInput.value = '';
  }
  addInput.focus();
}

/* 키보드 엔터 이벤트 */
function handleEnterKey(e) {
 if(e.code === 'Enter' && !e.shiftKey) {
  handleTodoList();

  //기본동작 차단하기 위해 (줄바꿈, 폼제출 등등)
  e.preventDefault();
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
  //filter() : 배열을 순회하며 콜백함수 조건을 만족하는 요소만 모아 새배열 생성
  todoListArray = todoListArray.filter(todo => todo.id !== id);
}

/* 삭제 버튼 이벤트 */
function handleRemove(e) {
  const btn = e.target.closest('.delete_btn');
  if(!btn) return;

  const li = btn.closest('li');
  if(!li) return;

  const id = li.dataset.id;

  removeItem(id);
  removeItemArray(id);
}

/* 근접한 delete_btn 찾아서 클릭 이벤트 */
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
  todoListArray = [];
  console.log(todoListArray);
  return todoListArray;

}

function handleRemoveAll(e) {
  const li = todoList.querySelector('li');
  if(!li) alert('삭제할 항목이 없습니다.');
  
  removeAllItem();
  removeAllItemArray();
}

allDelBtn.addEventListener('click',handleRemoveAll);
// 삭제 버튼은 동적으로 생성되기 때문에 부모에 이벤트
todoList.addEventListener('click',handleDelClick);

