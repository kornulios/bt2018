const resultsPerPage = 20;

export class Pagination {
  constructor() {
    this.pagesCount = 0;
    this.pagingContainer = document.querySelector("#results-paging");
  }

  render(resultsCount) {
    const pagesNum = resultsCount / resultsPerPage;

    if (pagesNum === this.pagesCount) {
      return;
    }

    this.pagesCount = pagesNum;

    let pagingButtons = [];

    pagingButtons.push(`<button type="button" class="btn-paging" name="prev">Prev</button>`);
    for (let i = 0; i < pagesNum; i++) {
      pagingButtons.push(`<button type="button" class="btn-paging" name=${i}>${i * 20 + 1}...${(i + 1) * 20}</button>`);
    }
    pagingButtons.push(`<button type="button" class="btn-paging" name="next">Next</button>`);

    this.pagingContainer.innerHTML = pagingButtons.join("");
  }
}