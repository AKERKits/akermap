require('./akermap').factory('formModal', function (btfModal) {
    'use strict';

  return btfModal({
    controller: 'addResourceForm',
    controllerAs: 'ctrl',
    templateUrl: require('./templates/addResourceForm.html')
  });

});
