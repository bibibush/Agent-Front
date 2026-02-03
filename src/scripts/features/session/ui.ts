interface SessionItemProps {
  title: string;
  onClick?: () => void;
}

export function createSessionItem(props: SessionItemProps): HTMLLIElement {
  const { title, onClick } = props;

  const li = document.createElement("li");
  li.className = "chat-item";
  li.textContent = title;

  if (onClick) {
    li.addEventListener("click", onClick);
  }

  return li;
}
