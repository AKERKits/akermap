require('./templates/addResourceForm.html');
require('./akermap').factory('formModal', ['btfModal', function (btfModal) {
    'use strict';

  return btfModal({
    controller: 'addResourceForm',
    controllerAs: 'ctrl',
    templateUrl: require('./templates/addResourceForm.html')
  });

}]);
