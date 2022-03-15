export const html = (id: string) => document.getElementById(id) as HTMLElement;

export const display = (id: string, is: boolean) => {
  html(id).style.display = is ? '' : 'none';
};
