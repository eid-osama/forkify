import View from './View.js';
import previewview from './previewView.js';
import icons from '../../img/icons.svg';
class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No Recipes found!';
  _message = '';

  _generateMarkup() {
    return this._data.map(result => previewview.render(result, false)).join('');
  }
}

export default new ResultView();
