export const handleLinkClick = (
  linkID: string,
  linkClass: string,
  activeClass: string,
  remove: boolean
) => {
  const links = document.getElementsByClassName(linkClass);
  for (let i = 0; i < links.length; i++) {
    links[i].classList.remove(activeClass);
  }
  if (!remove) {
    const link = document.getElementById(linkID)!;
    link.classList.add(activeClass);
  }
};
