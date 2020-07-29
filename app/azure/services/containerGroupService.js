import angular from 'angular';

import { ContainerGroupViewModel, CreateContainerGroupRequest } from '../models/container_group';

angular.module('portainer.azure').factory('ContainerGroupService', ContainerGroupServiceFactory);

function ContainerGroupServiceFactory(ContainerGroup) {
  return { containerGroups, containerGroup, create };

  async function containerGroups(subscriptionId) {
    try {
      const result = await ContainerGroup.query({ subscriptionId: subscriptionId }).$promise;
      return result.value.map((item) => new ContainerGroupViewModel(item));
    } catch (err) {
      throw { msg: 'Unable to retrieve container groups', err };
    }
  }

  async function containerGroup(subscriptionId, resourceGroupName, containerGroupName) {
    const containerGroup = await ContainerGroup.get({ subscriptionId, resourceGroupName, containerGroupName }).$promise;
    return new ContainerGroupViewModel(containerGroup);
  }

  function create(model, subscriptionId, resourceGroupName) {
    const payload = new CreateContainerGroupRequest(model);
    return ContainerGroup.create(
      {
        subscriptionId,
        resourceGroupName,
        containerGroupName: model.Name,
      },
      payload
    ).$promise;
  }
}
