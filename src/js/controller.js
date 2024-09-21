import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODEL_CLOSE_SEC } from './config.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// if (module.hot) {
//   module.hot.accept();
// }

async function controlRecipes() {
  try {
    // getting id
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    resultView.update(model.getSearchResultPage());
    //loading recipe
    await model.loadRecipe(id);
    const { recipe } = model.state;
    //render data

    recipeView.render(model.state.recipe);
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError(`${err}💥💥💥💥💥`);
  }
}

async function controlSearchReults() {
  try {
    resultView.renderSpinner();
    //get query
    const query = searchView.getQuery();
    if (!query) return;
    //loading search query
    await model.loadSearchResults(query);
    //loading data
    // resultView.render(model.state.search.results);
    resultView.render(model.getSearchResultPage());
    //render initial pagination btn
    paginationView.render(model.state.search);
  } catch (err) {
    resultView.renderError();
  }
}

function controlPagination(goToPage) {
  //loading new data
  resultView.render(model.getSearchResultPage(goToPage));
  //render new pagination btn
  paginationView.render(model.state.search);
}

function controlServings(newServings) {
  //update recipe servings
  model.updateServings(newServings);
  //update the view
  recipeView.update(model.state.recipe);
}

function controlAddBookmark(recipe) {
  if (!model.state.recipe.bookmarked) model.addBookmarks(model.state.recipe);
  else if (model.state.recipe.bookmarked)
    model.deleteBookmark(model.state.recipe.id);
  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
}

function controlBookmarks() {
  bookmarksView.render(model.state.bookmarks);
}

async function controlAddRecipe(newRecipe) {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    bookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      addRecipeView.toogleWindow();
    }, MODEL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
}

function inti() {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchReults);
  paginationView.addHandlerPagination(controlPagination);
  bookmarksView.addHandlerRender(controlBookmarks);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}
inti();
