import { RoutingMockProjectPage } from './app.po';

describe('routing-mock-project App', () => {
  let page: RoutingMockProjectPage;

  beforeEach(() => {
    page = new RoutingMockProjectPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
