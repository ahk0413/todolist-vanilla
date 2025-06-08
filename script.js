const addInput = document.querySelector('#addInput');
const addBtn = document.querySelector('#addBtn');
const allDelBtn = document.querySelector('#allDelBtn')
const todoList = document.querySelector('#todoList');
const inputWrap = todoForm.getElementsByClassName("input_wrap")[0];
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
  const id = crypto.randomUUID();

  // trim() :문자열 앞뒤의 공백을 제거
  if (value.trim().length === 0) {
    createErrorMsg();
    addInput.value = '';
    
  } else {
    renderItem({ target, value, id });
    addItemArray(id, value);
    const existingErrorMsg = inputWrap.querySelector(".inputErrorMsg");
    if (existingErrorMsg) existingErrorMsg.remove();
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
  //closest(): css선택자와 일치하는 가장 가까운 조상요소를 찾는데 사용.
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
  return todoListArray;

}

function handleRemoveAll(e) {
  const li = todoList.querySelector('li');
  const confirmAns = confirm('할 일 목록을 전부 삭제하시겠습니까?');
  if(!li) alert('삭제할 항목이 없습니다.');

  else if(confirmAns){ 
    removeAllItem();
    removeAllItemArray();
  }
}

allDelBtn.addEventListener('click',handleRemoveAll);
// 삭제 버튼은 동적으로 생성되기 때문에 부모에 이벤트
todoList.addEventListener('click',handleDelClick);


function createErrorMsg() {
    const errorMsg = document.createElement("div");
    errorMsg.className = "inputErrorMsg";
    errorMsg.innerHTML = `
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M11.9991 15.375V12M11.9991 8.625V8.70959M20.9983 12C20.9983 13.2938 20.7253 14.5238 20.2338 15.6356L21 20.9991L16.4039 19.85C15.1019 20.5823 13.5993 21 11.9991 21C7.02906 21 3 16.9706 3 12C3 7.02944 7.02906 3 11.9991 3C16.9692 3 20.9983 7.02944 20.9983 12Z"
                stroke="#FF6174"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round" />
		</svg>
		<span>할 일을 입력해주세요!</span>`

    if (!inputWrap.querySelector(".inputErrorMsg")) {
    inputWrap.appendChild(errorMsg);
  } 
} 