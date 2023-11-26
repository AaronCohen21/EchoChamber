module.exports = class Pagination {
  #urlBase;
  #queryParams;

  constructor(data, total, urlBase, queryParams) {
    this.limit = parseInt(queryParams.limit || 100);
    this.offset = parseInt(queryParams.offset || 0);
    this.data = data;
    this.total = total;

    this.#queryParams = queryParams;
    delete this.#queryParams.limit;
    delete this.#queryParams.offset;

    // Remove any query string from the url if it exists
    const baseUrlRegex = /[^\?]*/;
    this.#urlBase = baseUrlRegex.exec(urlBase)[0];

    this.self = this.#reconstructUrl(this.offset);
    if (this.limit + this.offset < total) {
      this.next = this.#reconstructUrl(this.limit + this.offset);
    }
    if (this.offset - this.limit >= 0) {
      this.prev = this.#reconstructUrl(this.offset - this.limit);
    }
  }

  static getEmptyPagination = (urlBase, query = {}) => {
    return new Pagination([], 0, urlBase, query);
  };

  #reconstructUrl = newOffset => {
    let url = `${this.#urlBase}?limit=${this.limit}&offset=${newOffset}`;
    Object.keys(this.#queryParams).forEach(param => {
      url += `&${param}=${encodeURIComponent(this.#queryParams[param])}`;
    });
    return url;
  };
};
