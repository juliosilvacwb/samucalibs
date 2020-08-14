var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import PropTypes from 'prop-types';
import React from 'react';
import './multi-select-aria.css';

var typingTimer = void 0;

var MultiSelectAria = function (_React$Component) {
  _inherits(MultiSelectAria, _React$Component);

  function MultiSelectAria(props) {
    _classCallCheck(this, MultiSelectAria);

    var _this = _possibleConstructorReturn(this, (MultiSelectAria.__proto__ || Object.getPrototypeOf(MultiSelectAria)).call(this, props));

    _initialiseProps.call(_this);

    _this.refInputEl = React.createRef();
    _this.hashId = btoa(new Date().getTime()).replace('==', '').toLowerCase().replace(/\d/g, '');

    var selecteds = [];
    if (props.multi) {
      selecteds = [].concat(_toConsumableArray(props.selected));
    } else if (!props.multi && props.selected) {
      selecteds = [props.selected];
    }

    _this.state = {
      width: 100,
      options: props.options,
      selecteds: selecteds,
      optionSelected: 0,
      showOptionList: false,
      isLoading: false,
      filter: '',
      activedescendant: props.options.length > 0 ? props.options[0][props.labelKey] : null
    };
    return _this;
  }

  _createClass(MultiSelectAria, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(newProps) {
      var selected = newProps.selected,
          newIsLoading = newProps.isLoading,
          newOptions = newProps.options,
          statick = newProps.statick;
      var _state = this.state,
          selecteds = _state.selecteds,
          isLoading = _state.isLoading,
          options = _state.options,
          filter = _state.filter;
      var _props = this.props,
          minimumInput = _props.minimumInput,
          labelKey = _props.labelKey,
          valueKey = _props.valueKey,
          showOptionSelected = _props.showOptionSelected;


      if (!Array.isArray(selected)) {
        selected = selected && selected[valueKey] ? [selected] : [];
      }

      var state = Object.assign({}, this.state, { optionSelected: 0, activedescendant: this.hashId + '-item-' + 0, isLoading: newIsLoading });
      var isOptionsEquals = this.isListEquals(newOptions, options);
      var isSeletedsEquals = this.isListEquals(selected, selecteds);
      var isInputMinimum = filter.length >= minimumInput;
      var isLoadingEquals = newIsLoading !== isLoading;

      if (!isOptionsEquals && isInputMinimum) {
        if (!showOptionSelected) {
          var _options = newOptions.filter(function (item) {
            return selecteds.filter(function (selected) {
              return item[labelKey] === selected[labelKey];
            }).length === 0;
          });

          if (!isSeletedsEquals) {
            this.setState(Object.assign({}, state, { options: _options, selecteds: selected }));
          } else {
            this.setState(Object.assign({}, state, { options: _options }));
          }
        } else {
          if (!isSeletedsEquals) {
            this.setState(Object.assign({}, state, { selecteds: selected, options: newOptions }));
          } else {
            this.setState(Object.assign({}, state, { options: newOptions }));
          }
        }
      } else if (!isOptionsEquals && !isInputMinimum && statick) {
        this.setState(Object.assign({}, this.state, { options: newOptions, isLoading: newIsLoading }));
      } else if (isLoadingEquals) {
        if (!isSeletedsEquals) {
          this.setState(Object.assign({}, state, { selecteds: selected }));
        } else {
          this.setState(Object.assign({}, state));
        }
      } else if (!isSeletedsEquals) {
        this.setState(Object.assign({}, this.state, { selecteds: selected }));
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {

      if (this.props.multi && this.props.initialValue) {
        this.props.onSelect([].concat(_toConsumableArray(this.props.selected), [this.props.initialValue]));
      } else if (!this.props.multi && !this.props.selected && this.props.initialValue) {
        this.props.onSelect(this.props.initialValue);
      }

      document.addEventListener("mousedown", this.handleClickOutside);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.removeEventListener("mousedown", this.handleOptionClick);
    }
  }, {
    key: 'isListEquals',
    value: function isListEquals(a, b) {
      var _this2 = this;

      return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every(function (val, index) {
        return val[_this2.props.labelKey] === b[index][_this2.props.labelKey] && val[_this2.props.valueKey] === b[index][_this2.props.valueKey];
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return React.createElement(
        'div',
        { style: { display: 'flex', alignItems: 'center' } },
        React.createElement(
          'div',
          { className: 'msa-container' },
          React.createElement(
            'div',
            {
              id: this.hashId,
              className: 'msa-main ' + (this.props.classBox ? this.props.classBox : ''),
              onClick: function onClick() {
                return _this3.refInputEl.current.focus();
              }
            },
            this.props.multi && this.state.selecteds.map(function (item, y) {
              return React.createElement(
                'span',
                { key: y, className: 'chip' },
                item[_this3.props.labelKey]
              );
            }),
            React.createElement('input', {
              id: this.props.id ? this.props.id : undefined,
              ref: this.refInputEl,
              placeholder: this.props.multi || this.state.selecteds.length === 0 ? this.props.placeholder : '',
              type: 'text',
              value: this.state.filter,
              className: this.hashId + ' msa-input ' + (this.props.classInput ? this.props.classInput : '') + ' ' + (this.props.multi || this.state.selecteds.length === 0 ? 'msa-input-multi' : ''),
              onChange: function onChange(e) {
                return _this3.onChange(e.target.value);
              },
              onFocus: this.handleListDisplay,
              onKeyDown: this.onKeyControl,
              style: {
                width: !this.props.multi && this.state.selecteds.length > 0 ? '2px' : undefined
              },
              'aria-multiselectable': true,
              'aria-haspopup': 'listbox',
              'aria-expanded': this.state.showOptionList,
              'aria-controls': this.props.listName ? this.props.listName : 'options-' + this.hashId,
              'aria-owns': this.props.listName ? this.props.listName : 'options-' + this.hashId,
              'aria-activedescendant': this.state.activedescendant,
              'aria-autocomplete': 'list',
              autoComplete: 'off'
            }),
            !this.props.multi && this.state.selecteds.length > 0 && this.state.selecteds[0] && this.state.selecteds[0].hasOwnProperty(this.props.labelKey) && React.createElement(
              'span',
              { className: 'chip-single' },
              this.state.selecteds[0][this.props.labelKey]
            )
          ),
          this.state.showOptionList && React.createElement(
            'ul',
            {
              role: 'listbox',
              className: 'select-options ' + (this.props.classOptions ? this.props.classOptions : ''),
              style: { maxWidth: this.state.width, minWidth: this.state.width },
              id: this.props.listName ? this.props.listName : 'options-' + this.hashId
            },
            !this.state.isLoading && this.state.options.map(function (option, i) {
              return React.createElement(
                'li',
                {
                  id: _this3.hashId + '-item-' + i,
                  role: 'option',
                  className: _this3.hashId + ' custom-select-option \n                                              ' + (_this3.props.classOptionsItem ? _this3.props.classOptionsItem : '') + ' \n                                              ' + (_this3.state.optionSelected === i ? ' selected' : '') + '\n                                            ',
                  'data-name': option[_this3.props.labelKey],
                  key: i,
                  onClick: function onClick() {
                    return _this3.handleOptionSelected(i);
                  },
                  onMouseOver: function onMouseOver() {
                    return _this3.onOptionOver(i);
                  },
                  'aria-selected': _this3.state.activedescendant === _this3.hashId + '-item-' + i
                },
                option[_this3.props.labelKey]
              );
            }),
            this.state.options.length === 0 && !this.state.isLoading && !this.props.statick && React.createElement(
              'li',
              {
                className: 'custom-select-option',
                role: 'option',
                'aria-selected': this.state.options.length === 0 && !this.state.isLoading && !this.props.statick,
                id: this.hashId + '-item-' + 0
              },
              this.state.filter.length < this.props.minimumInput ? this.props.searchPromptText : this.props.noResultsText
            ),
            this.state.isLoading && React.createElement(
              'li',
              {
                className: 'custom-select-option',
                role: 'option',
                'aria-selected': this.state.isLoading,
                id: this.hashId + '-item-' + 0
              },
              this.props.isLoadingText
            )
          )
        ),
        React.createElement(
          'button',
          {
            'aria-label': 'Clear',
            className: 'clear ' + (this.props.cassClearButton ? this.props.cassClearButton : ''),
            onClick: function onClick() {
              return _this3.clearListOfSelecteds();
            }
          },
          'x'
        )
      );
    }
  }]);

  return MultiSelectAria;
}(React.Component);

var _initialiseProps = function _initialiseProps() {
  var _this4 = this;

  this.handleClickOutside = function (e) {
    if (!e.target.classList.contains(_this4.hashId)) {
      _this4.setState(Object.assign({}, _this4.state, {
        showOptionList: false,
        optionSelected: 0
      }));
    }
  };

  this.handleListDisplay = function () {
    var width = document.getElementById(_this4.hashId).offsetWidth;
    _this4.setState(Object.assign({}, _this4.state, { showOptionList: true, width: width, activedescendant: _this4.hashId + '-item-' + 0 }));
  };

  this.handleOptionSelected = function (index) {
    var showOptionList = false;
    if (_this4.props.multi) {
      _this4.refInputEl.current.focus();
      showOptionList = true;
    }

    var selecteds = _this4.props.multi ? [].concat(_toConsumableArray(_this4.state.selecteds), [_this4.state.options[index]]) : [_this4.state.options[index]];

    if (_this4.props.statick) {
      _this4.setState(Object.assign({}, _this4.state, { selecteds: selecteds, filter: '', showOptionList: showOptionList }));
    } else {
      _this4.setState(Object.assign({}, _this4.state, { selecteds: selecteds, options: [], filter: '', showOptionList: showOptionList }));
    }

    setTimeout(function () {
      if (_this4.props.onSelect) {
        if (_this4.props.multi) {
          _this4.props.onSelect(selecteds);
        } else {
          _this4.props.onSelect(selecteds[0]);
        }
        if (_this4.props.onInputChange) {
          _this4.props.onInputChange('');
        }
      }
    }, 500);
  };

  this.clearListOfSelecteds = function () {
    var selecteds = _this4.props.initialValue ? [_this4.props.initialValue] : [];
    _this4.setState(Object.assign({}, _this4.state, { selecteds: selecteds, filter: '' }));

    if (_this4.props.onSelect) {
      if (_this4.props.multi && !_this4.props.statick) {
        _this4.props.onSelect([]);
      } else if (_this4.props.multi && _this4.props.statick) {
        _this4.props.onSelect(selecteds);
      } else if (!_this4.props.multi && _this4.props.statick) {
        _this4.props.onSelect(_this4.props.initialValue);
      } else {
        _this4.props.onSelect(undefined);
      }
    }

    setTimeout(function () {
      _this4.refInputEl.current.focus();
    }, 300);
  };

  this.onKeyControl = function (e) {
    if (e.key === 'ArrowDown') {
      if (_this4.state.optionSelected < _this4.state.options.length - 1) {
        _this4.onOptionOver(_this4.state.optionSelected + 1);
      } else {
        _this4.onOptionOver(Object.assign({}, _this4.state, { optionSelected: 0 }));
      }
    } else if (e.key === 'ArrowUp') {
      if (_this4.state.optionSelected > 0) {
        _this4.onOptionOver(_this4.state.optionSelected - 1);
      } else {
        _this4.onOptionOver(_this4.state.options.length - 1);
      }
    }

    if (e.key === 'Enter') {
      if (_this4.state.options.length > 0) {
        _this4.handleOptionSelected(_this4.state.optionSelected);
      }
    }

    if (e.key === 'Tab') {
      _this4.setState(Object.assign({}, _this4.state, { showOptionList: false }));
    }

    if (e.key === 'Backspace') {
      if (_this4.state.filter.length === 0) {
        var selecteds = _this4.state.selecteds.slice(0, _this4.state.selecteds.length - 1);
        if (selecteds.length === 0 && _this4.props.initialValue) {
          selecteds = [_this4.props.initialValue];
        }
        _this4.setState(Object.assign({}, _this4.state, { selecteds: selecteds }));
        setTimeout(function () {
          return _this4.props.onSelect(selecteds);
        }, 300);
      }
    }
  };

  this.onChange = function (value) {
    var options = _this4.props.statick ? _this4.state.options.filter(function (item) {
      return item[_this4.props.labelKey].toLowerCase().includes(value.toLowerCase());
    }) : _this4.state.options;
    if (_this4.props.multi) {
      _this4.setState(Object.assign({}, _this4.state, { options: options, filter: value }));
    } else {
      _this4.setState(Object.assign({}, _this4.state, { options: options, filter: value, selecteds: [] }));
      setTimeout(function () {
        return _this4.props.onSelect(undefined);
      });
    }

    if (!_this4.props.statick) {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(function () {
        if (_this4.props.onInputChange && value.length >= _this4.props.minimumInput) {
          _this4.props.onInputChange(value);
        }
      });
    }
  };

  this.onOptionOver = function (index) {
    var activedescendant = _this4.hashId + '-item-' + index;
    _this4.setState(Object.assign({}, _this4.state, { optionSelected: index, activedescendant: activedescendant }));
  };

  this.optionsWithoutSelecteds = function () {
    return _this4.state.options.filter(function (item) {
      return _this4.state.selecteds.filter(function (selected) {
        return item[_this4.props.labelKey] === selected[_this4.props.labelKey];
      }).length === 0;
    });
  };
};

MultiSelectAria.propTypes = {
  options: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  selected: function selected(props, propName, componentName) {
    if (!props.hasOwnProperty(propName)) {
      return new Error('selected is required.');
    }
    if (props.multi && !Array.isArray(props.selected)) {
      throw Error('selected should be a array for multi selections');
    }
  }
};

MultiSelectAria.defaultProps = {
  isLoadingText: 'It\'s Loading',
  noResultsText: 'It\'s empty',
  placeholder: '',
  searchPromptText: 'Type to search',
  minimumInput: 3,
  labelKey: 'label',
  valueKey: 'value'
};

export default MultiSelectAria;