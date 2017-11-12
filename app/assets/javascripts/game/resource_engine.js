
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

            this.refreshView();
        },

        addGenerator: function(generator) {
            this._generators.push(generator);
            this.setupView();
        },

        addConsumer: function(consumer) {
            this._consumers.push(consumer);
            this.setupView();
        },

        addResource: function(resource) {
            this._resources.push(resource);
            this.setupView();
        },

        resourceForKey: function(resourceKey) {
            // TODO inefficient?
            for (var i = 0, resourceLength = this._resources.length; i < resourceLength; i++) {
                var resource = this._resources[i];
                if (resource.key === resourceKey) {
                    return resource;
                }
            }
            return null;
        },

        setupView: function() {
            // Re-renders everything (don't want to do this often)
            this._setupGeneratorsView();
            this._setupConsumersView();
            this._setupResourcesView();
            this._setupDetailsView();
            this.refreshView();
        },

        refreshView: function() {
            // Refreshes all the views (ok to call this often)
            this._refreshGeneratorsView();
            this._refreshConsumersView();
            this._refreshResourcesView();
            //this._refreshDetailsView();
        },

        _setupGeneratorsView: function() {
            var $generators = $('#generators');

            this._setupDeviceList($generators.find('.device-list'), 'generator');
            //this._setupDeviceDetails($generators.find('.device-details'), 'generator');
        },
        _setupConsumersView: function() {
            var $consumers = $('#consumers');

            this._setupDeviceList($consumers.find('.device-list'), 'consumer');
            //this._setupDeviceDetails($consumers.find('.device-details'), 'consumer');
        },
        _setupResourcesView: function() {
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

        _setupDeviceList: function($table, type) {
            var self = this;
            var $tbody = $table.find('tbody');
            var $deviceTemplate = $tbody.find('.template');

            $tbody.find('tr.device').remove(); // Clear out everything

            var deviceArray;
            if (type === 'generator') {
                deviceArray = this._generators;
            }
            else if (type === 'consumer') {
                deviceArray = this._consumers;
            }

            deviceArray.forEach(function(device) {
                var $clone = $deviceTemplate.clone();
                $clone.removeClass('template').addClass('device');
                device.$row = $clone;

                this._setupName(device);
                this._setupSwitch(device);

                $clone.insertBefore($deviceTemplate);
                $clone.show();
            }, this);
        },

        _setupDetailsView: function() {
            var self = this;
            this._$details = $('#device-details');
            //this._$details.find('.close').off('click').on('click', function(evt) {
            //    evt.preventDefault();
            //    self._$details.hide();
            //});
        },

        //_setupDeviceDetails: function($details, type) {
        //    if (type === 'generator') {
        //        this._$generatorDetails = $details;
        //    }
        //    else if (type === 'consumer') {
        //        this._$consumerDetails = $details;
        //    }
        //
        //    $details.find('.close').off('click').on('click', function(evt) {
        //        evt.preventDefault();
        //        $details.hide();
        //    });
        //},

        _showDetails: function($details, device) {
            // show
            //var $details = device.type === 'generator' ? this._$generatorDetails : this._$consumerDetails;
            //$details.show();

            // id
            $details.data('id', device.id);

            // name
            $details.find('.name').html(device.name());

            // unique
            $details.find('.unique-label').toggle(device.unique());

            // description
            $details.find('.description').html(device.description());

            // materials
            var $materialsHeader = $details.find('.materials-header');
            var $materialTemplate = $details.find('.material-template');
            $details.find('.material').remove();
            if (SpacePirate.Utilities.objectSize(device.materials()) > 0) {
                $materialsHeader.show();
                SpacePirate.Utilities.iterateObject(device.materials(), function(materialKey, quantity) {
                    var resource = this.resourceForKey(materialKey);

                    var $clone = $materialTemplate.clone();
                    $clone.removeClass('material-template').addClass('material');

                    $clone.find('.material-name').html(resource.name());
                    $clone.find('.material-quantity').html(quantity + ' ' +resource.units());

                    $clone.insertBefore($materialTemplate);
                    $clone.show();
                }, this);
            }
            else {
                $materialsHeader.hide();
            }

            // consumption
            if (device.type === 'generator') {
                $details.find('.energy-description').html('Generates:');
            }
            else if (device.type === 'consumer') {
                $details.find('.energy-description').html('Consumes:');
            }
            this._displayPower($details.find('.energy-rate'), device.resourceRateDescription('energy'));

            // build
        },

        _setupName: function(device) {
            var self = this;
            var $name = device.$row.find('.name');
            $name.html(device.name() + ' ('+device.quantity()+')');

            // TODO NEW:
            //$.widget("ui.tooltip", $.ui.tooltip, {
            //    options: {
            //        content: function () {
            //            return $(this).prop('title');
            //        }
            //    }
            //});
            $name.attr('title', this._$details.html());

            $name.tooltip({
                track: true,
                content: function() {
                    return $(this).prop('title');
                },
                open: function(evt, ui) {
                    console.log('open!'+evt+ui);

                    $("div.ui-helper-hidden-accessible").remove();
                    self._showDetails(ui.tooltip, device);
                },
                classes: {
                    "ui-tooltip": "device-details"
                }
            });

            //$name.off('click').on('click', function(evt) {
            //    evt.preventDefault();
            //
            //    //var $currentDetails = device.type === 'generator' ? self._$generatorDetails : self._$consumerDetails;
            //    if (self._$details.is(':visible') && device.id === self._$details.data('id')) {
            //        self._$details.hide();
            //    }
            //    else {
            //        self._showDetails(device);
            //    }
            //});
        },
        _setupSwitch: function(device) {
            var self = this;
            var $onOff = device.$row.find('.on-off');
            $onOff.off('click').on('click', function(evt) {
                evt.preventDefault();
                if ($onOff.hasClass('fa-toggle-off')) {
                    $onOff.removeClass('fa-toggle-off ').addClass('fa-toggle-on ');
                    device.turnOn();
                    self._refreshGeneratorsView();
                    self._refreshConsumersView();
                }
                else {
                    $onOff.removeClass('fa-toggle-on ').addClass('fa-toggle-off ');
                    device.turnOff();
                    self._refreshGeneratorsView();
                    self._refreshConsumersView();
                }
            });
        },

        _refreshGeneratorsView: function() {
            this._generators.forEach(function(generator) {
                this._displayPower(generator.$row.find('.value'), generator.resourceRate('energy'));
                this._refreshSwitch(generator);
            }, this);
        },
        _refreshConsumersView: function() {
            this._consumers.forEach(function(consumer) {
                this._displayPower(consumer.$row.find('.value'), consumer.resourceRate('energy'));
                this._refreshSwitch(consumer);
            }, this);
        },
        _refreshResourcesView: function() {
            this._resources.forEach(function(resource) {
                this._displayEnergy(resource);
            }, this);
        },

        _refreshSwitch: function(device) {
            var $onOff = device.$row.find('.on-off');
            if (device.anyOn()) {
                $onOff.removeClass('fa-toggle-off ').addClass('fa-toggle-on ');
            }
            else {
                $onOff.removeClass('fa-toggle-on ').addClass('fa-toggle-off ');
            }
        },

        _displayPower: function($element, value) {
            if (value === 0) {
                $element.html(value+' W\u00A0').removeClass('positive-value negative-value').addClass('neutral-value');
            }
            else if (value > 0) {
                $element.html('+'+value+' W\u00A0').removeClass('neutral-value negative-value').addClass('positive-value');
            }
            else if (value < 0) {
                $element.html(value+' W\u00A0').removeClass('positive-value neutral-value').addClass('negative-value');
            }
        },

        _displayEnergy: function(resource) {
            var $element = resource.$row.find('.value');
            var value = resource.amount;
            $element.html(value+' '+resource.units());
        },

        _generate: function(seconds) {
            for (var i = 0, resourceLength = this._resources.length; i < resourceLength; i++) {
                var resource = this._resources[i];

                for (var j = 0, generatorsLength = this._generators.length; j < generatorsLength; j++) {
                    var generator = this._generators[j];
                    if (!generator.anyOn()) {
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
                    if (!consumer.anyOn()) {
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