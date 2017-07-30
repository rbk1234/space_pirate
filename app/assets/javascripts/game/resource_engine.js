
(function ($) {

    var ResourceEngine = function() {
        this._init();
    };
    ResourceEngine.prototype = {

        _init: function() {
            this._resources = [];
            this._generators = [];
            this._consumers = [];
        },

        update: function(iterations, period) { // period is in seconds
            //var seconds = iterations * period;

            while (iterations > 0) {
                iterations--;
                this._generate(period);
                this._consume(period);
            }

            this.updateView();
        },

        addGenerator: function(generator) {
            this._generators.push(generator);
            this.reloadView();
        },

        addConsumer: function(consumer) {
            this._consumers.push(consumer);
            this.reloadView();
        },

        addResource: function(resource) {
            this._resources.push(resource);
            this.reloadView();
        },

        reloadView: function() {
            // Re-renders everything (don't want to do this often)
            this._reloadGeneratorsView();
            this._reloadConsumersView();
            this._reloadResourcesView();
            this.updateView();
        },
        updateView: function() {
            // Updates all the views (ok to call this often)
            this._updateGeneratorsView();
            this._updateConsumersView();
            this._updateResourcesView();
        },

        _reloadGeneratorsView: function() {
            var self = this;
            var $generators = $('#generators');
            var $generatorTbody = $generators.find('tbody');
            var $generatorTemplate = $generatorTbody.find('.template');

            $generatorTbody.find('tr:not(.template)').remove();

            this._generators.forEach(function(generator) {
                var $clone = $generatorTemplate.clone();
                $clone.removeClass('template');
                generator.$row = $clone;

                $clone.find('.name').html(generator.name());
                this._setupSwitch(generator);

                $generatorTbody.append($clone);
                $clone.show();
            }, this);
        },
        _reloadConsumersView: function() {
            var $consumers = $('#consumers');
            var $consumerTbody = $consumers.find('tbody');
            var $consumerTemplate = $consumerTbody.find('.template');

            $consumerTbody.find('tr:not(.template)').remove();

            this._consumers.forEach(function(consumer) {
                var $clone = $consumerTemplate.clone();
                $clone.removeClass('template');
                consumer.$row = $clone;

                $clone.find('.name').html(consumer.name());
                this._setupSwitch(consumer);

                $consumerTbody.append($clone);
                $clone.show();
            }, this);
        },
        _reloadResourcesView: function() {
            var $resources = $('#resources');
            var $resourceTbody = $resources.find('tbody');
            var $resourceTemplate = $resourceTbody.find('.template');

            $resourceTbody.find('tr:not(.template)').remove();

            this._resources.forEach(function(resource) {
                var $clone = $resourceTemplate.clone();
                $clone.removeClass('template');

                $clone.find('.name').html(resource.name());

                $resourceTbody.append($clone);
                $clone.show();
                resource.$row = $clone;
            }, this);
        },

        _setupSwitch: function(device) {
            var self = this;
            var $onOff = device.$row.find('.on-off');
            $onOff.off('click').on('click', function(evt) {
                evt.preventDefault();
                if ($onOff.hasClass('fa-toggle-off')) {
                    $onOff.removeClass('fa-toggle-off ').addClass('fa-toggle-on ');
                    device.turnOn();
                    self._updateGeneratorsView();
                    self._updateConsumersView();
                }
                else {
                    $onOff.removeClass('fa-toggle-on ').addClass('fa-toggle-off ');
                    device.turnOff();
                    self._updateGeneratorsView();
                    self._updateConsumersView();
                }
            });
        },

        _updateGeneratorsView: function() {
            this._generators.forEach(function(generator) {
                this._displayPower(generator);
                this._updateSwitch(generator);
            }, this);
        },
        _updateConsumersView: function() {
            this._consumers.forEach(function(consumer) {
                this._displayPower(consumer);
                this._updateSwitch(consumer);
            }, this);
        },
        _updateResourcesView: function() {
            this._resources.forEach(function(resource) {
                this._displayEnergy(resource);
            }, this);
        },

        _updateSwitch: function(device) {
            var $onOff = device.$row.find('.on-off');
            if (device.running) {
                $onOff.removeClass('fa-toggle-off ').addClass('fa-toggle-on ');
            }
            else {
                $onOff.removeClass('fa-toggle-on ').addClass('fa-toggle-off ');
            }
        },

        _displayPower: function(device) {
            var $element = device.$row.find('.value');
            var value = device.resourceRate('energy');

            if (value === 0) {
                $element.html(value+' W').removeClass('positive-value negative-value').addClass('neutral-value');
            }
            else if (value > 0) {
                $element.html('+'+value+' W').removeClass('neutral-value negative-value').addClass('positive-value');
            }
            else if (value < 0) {
                $element.html(value+' W').removeClass('positive-value neutral-value').addClass('negative-value');
            }
        },

        _displayEnergy: function(resource) {
            var $element = resource.$row.find('.value');
            var value = resource.amount;
            $element.html(value+' Ws');
        },

        _generate: function(seconds) {
            for (var i = 0, resourceLength = this._resources.length; i < resourceLength; i++) {
                var resource = this._resources[i];

                for (var j = 0, generatorsLength = this._generators.length; j < generatorsLength; j++) {
                    var generator = this._generators[j];
                    if (!generator.running) {
                        continue;
                    }

                    resource.amount += generator.resourceRate(resource.key) * seconds;
                }
            }
        },

        _consume: function(seconds) {
            for (var i = 0, resourceLength = this._resources.length; i < resourceLength; i++) {
                var resource = this._resources[i];

                for (var j = 0, consumersLength = this._consumers.length; j < consumersLength; j++) {
                    var consumer = this._consumers[j];
                    if (!consumer.running) {
                        continue;
                    }

                    var consumption = consumer.resourceRate(resource.key) * seconds;
                    if (resource.amount + consumption >= 0) {
                        resource.amount += consumption;
                        consumer.run(seconds);
                    }
                    else {
                        consumer.turnOff();
                    }
                }
            }
        }

    };

    SpacePirate.namespace('Game').ResourceEngine = ResourceEngine;

}(jQuery));