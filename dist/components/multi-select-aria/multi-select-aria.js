var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';
import './multi-select-aria.css';

var typingTimer = void 0;

var MultiSelectAria = function (_React$Component) {
  _inherits(MultiSelectAria, _React$Component);

  function MultiSelectAria(props) {
    _classCallCheck(this, MultiSelectAria);

    var _this = _possibleConstructorReturn(this, (MultiSelectAria.__proto__ || Object.getPrototypeOf(MultiSelectAria)).call(this, props));

    _this.handleClickOutside = function (e) {
      if (!e.target.classList.contains(_this.hashId)) {
        _this.setState(Object.assign({}, _this.state, {
          showOptionList: false,
          optionSelected: 0
        }));
      }
    };

    _this.handleListDisplay = function () {
      var width = document.getElementById(_this.hashId).offsetWidth;
      _this.setState(Object.assign({}, _this.state, { showOptionList: true, width: width, activedescendant: _this.hashId + '-item-' + 0 }));
    };

    _this.handleOptionSelected = function (index) {
      var showOptionList = false;
      if (_this.multi) {
        _this.refInputEl.current.focus();
        showOptionList = true;
      }

      var selecteds = _this.multi ? [].concat(_toConsumableArray(_this.state.selecteds), [_this.state.options[index]]) : [_this.state.options[index]];

      if (_this.props.static) {
        _this.setState(Object.assign({}, _this.state, { selecteds: selecteds, filter: '', showOptionList: showOptionList }));
      } else {
        _this.setState(Object.assign({}, _this.state, { selecteds: selecteds, options: [], filter: '', showOptionList: showOptionList }));
      }

      setTimeout(function () {
        if (_this.props.onSelect) {
          if (_this.multi) {
            _this.props.onSelect(selecteds);
          } else {
            _this.props.onSelect(selecteds[0]);
          }
          if (_this.props.onInputChange) {
            _this.props.onInputChange('');
          }
        }
      }, 500);
    };

    _this.clearListOfSelecteds = function () {
      var selecteds = _this.props.initialValue ? [_this.props.initialValue] : [];
      _this.setState(Object.assign({}, _this.state, { selecteds: selecteds, filter: '' }));

      if (_this.props.onSelect) {
        if (_this.multi && !_this.props.static) {
          _this.props.onSelect([]);
        } else if (_this.multi && _this.props.static) {
          _this.props.onSelect(selecteds);
        } else if (!_this.multi && _this.props.static) {
          _this.props.onSelect(_this.props.initialValue);
        } else {
          _this.props.onSelect(undefined);
        }
      }

      setTimeout(function () {
        _this.refInputEl.current.focus();
      }, 300);
    };

    _this.onKeyControl = function (e) {
      if (e.key === 'ArrowDown') {
        if (_this.state.optionSelected < _this.state.options.length - 1) {
          _this.onOptionOver(_this.state.optionSelected + 1);
        } else {
          _this.onOptionOver(Object.assign({}, _this.state, { optionSelected: 0 }));
        }
      } else if (e.key === 'ArrowUp') {
        if (_this.state.optionSelected > 0) {
          _this.onOptionOver(_this.state.optionSelected - 1);
        } else {
          _this.onOptionOver(_this.state.options.length - 1);
        }
      }

      if (e.key === 'Enter') {
        if (_this.state.options.length > 0) {
          _this.handleOptionSelected(_this.state.optionSelected);
        }
      }

      if (e.key === 'Tab') {
        _this.setState(Object.assign({}, _this.state, { showOptionList: false }));
      }

      if (e.key === 'Backspace') {
        if (_this.state.filter.length === 0) {
          var selecteds = _this.state.selecteds.slice(0, _this.state.selecteds.length - 1);
          if (selecteds.length === 0 && _this.props.initialValue) {
            selecteds = [_this.props.initialValue];
          }
          _this.setState(Object.assign({}, _this.state, { selecteds: selecteds }));
        }
      }
    };

    _this.onChange = function (value) {
      var options = _this.props.static ? _this.state.options.filter(function (item) {
        return item[_this.labelKey].toLowerCase().includes(value.toLowerCase());
      }) : _this.state.options;
      if (_this.multi) {
        _this.setState(Object.assign({}, _this.state, { options: options, filter: value }));
      } else {
        _this.setState(Object.assign({}, _this.state, { options: options, filter: value, selecteds: [] }));
      }

      if (!_this.props.static) {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(function () {
          if (_this.props.onInputChange && value.length >= _this.minimumInput) {
            _this.props.onInputChange(value);
          }
        }, 500);
      }
    };

    _this.onOptionOver = function (index) {
      var activedescendant = _this.hashId + '-item-' + index;
      _this.setState(Object.assign({}, _this.state, { optionSelected: index, activedescendant: activedescendant }));
    };

    _this.optionsWithoutSelecteds = function () {
      return _this.state.options.filter(function (item) {
        return _this.state.selecteds.filter(function (selected) {
          return item[_this.labelKey] === selected[_this.labelKey];
        }).length === 0;
      });
    };

    _this.isLoadingText = props.isLoadingText ? props.isLoadingText : 'It\'s Loading';
    _this.noResultsText = props.noResultsText ? props.noResultsText : 'It\'s empty';
    _this.placeholder = props.placeholder ? props.placeholder : '';
    _this.searchPromptText = props.searchPromptText ? props.searchPromptText : 'Type to search';
    _this.minimumInput = props.minimumInput ? props.minimumInput : 3;
    _this.refInputEl = React.createRef();
    _this.multi = !!_this.props.multi;
    _this.labelKey = props.labelKey ? props.labelKey : 'label';
    _this.valueKey = props.valueKey ? props.valueKey : 'value';

    _this.hashId = btoa(new Date().getTime()).replace('==', '').toLowerCase().replace(/\d/g, '');

    _this.state = {
      width: 100,
      options: props.options,
      selecteds: props.initialValue ? [props.initialValue] : [],
      optionSelected: 0,
      showOptionList: false,
      isLoading: false,
      filter: '',
      activedescendant: props.options.length > 0 ? props.options[0][_this.labelKey] : null
    };
    return _this;
  }

  _createClass(MultiSelectAria, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(newProps) {
      var _this2 = this;

      if (!this.isListEquals(newProps.options, this.state.options) && this.state.filter.length > this.minimumInput) {
        if (!this.props.showOptionSelected) {
          var options = newProps.options.filter(function (item) {
            return _this2.state.selecteds.filter(function (selected) {
              return item[_this2.labelKey] === selected[_this2.labelKey];
            }).length === 0;
          });
          this.setState(Object.assign({}, this.state, { options: options, optionSelected: 0, activedescendant: this.hashId + '-item-' + 0, isLoading: newProps.isLoading }));
        } else {
          this.setState(Object.assign({}, this.state, { options: newProps.options, optionSelected: 0, activedescendant: this.hashId + '-item-' + 0, isLoading: newProps.isLoading }));
        }
      } else if (newProps.isLoading !== this.state.isLoading) {
        this.setState(Object.assign({}, this.state, { isLoading: newProps.isLoading, optionSelected: 0, activedescendant: this.hashId + '-item-' + 0 }));
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
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
      var _this3 = this;

      return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every(function (val, index) {
        return val[_this3.labelKey] === b[index][_this3.labelKey] && val[_this3.valueKey] === b[index][_this3.valueKey];
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

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
                return _this4.refInputEl.current.focus();
              }
            },
            this.multi && this.state.selecteds.map(function (item, y) {
              return React.createElement(
                'span',
                { key: y, className: 'chip' },
                item[_this4.labelKey]
              );
            }),
            React.createElement('input', {
              id: this.props.id ? this.props.id : undefined,
              ref: this.refInputEl,
              placeholder: this.multi || this.state.selecteds.length === 0 ? this.placeholder : '',
              type: 'text',
              value: this.state.filter,
              className: this.hashId + ' msa-input ' + (this.props.classInput ? this.props.classInput : '') + ' ' + (this.multi || this.state.selecteds.length === 0 ? 'msa-input-multi' : ''),
              onChange: function onChange(e) {
                return _this4.onChange(e.target.value);
              },
              onFocus: this.handleListDisplay,
              onKeyDown: this.onKeyControl,
              style: {
                width: !this.multi && this.state.selecteds.length > 0 ? '2px' : undefined
              },
              'aria-multiselectable': true,
              'aria-haspopup': 'listbox',
              'aria-expanded': this.state.showOptionList,
              'aria-controls': this.props.listName ? this.props.listName : 'options-' + this.hashId,
              'aria-owns': this.props.listName ? this.props.listName : 'options-' + this.hashId,
              'aria-activedescendant': this.state.activedescendant,
              'aria-autocomplete': 'list'
            }),
            !this.multi && this.state.selecteds.length > 0 && React.createElement(
              'span',
              { className: 'chip-single' },
              this.state.selecteds[0][this.labelKey]
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
                  id: _this4.hashId + '-item-' + i,
                  role: 'option',
                  className: _this4.hashId + ' custom-select-option \n                                              ' + (_this4.props.classOptionsItem ? _this4.props.classOptionsItem : '') + ' \n                                              ' + (_this4.state.optionSelected === i ? ' selected' : '') + '\n                                            ',
                  'data-name': option[_this4.labelKey],
                  key: i,
                  onClick: function onClick() {
                    return _this4.handleOptionSelected(i);
                  },
                  onMouseOver: function onMouseOver() {
                    return _this4.onOptionOver(i);
                  },
                  'aria-selected': _this4.state.activedescendant === _this4.hashId + '-item-' + i
                },
                option[_this4.labelKey]
              );
            }),
            this.state.options.length === 0 && !this.state.isLoading && !this.props.static && React.createElement(
              'li',
              {
                className: 'custom-select-option',
                role: 'option',
                'aria-selected': this.state.options.length === 0 && !this.state.isLoading && !this.props.static,
                id: this.hashId + '-item-' + 0
              },
              this.state.filter.length < this.minimumInput ? this.searchPromptText : this.noResultsText
            ),
            this.state.isLoading && React.createElement(
              'li',
              {
                className: 'custom-select-option',
                role: 'option',
                'aria-selected': this.state.isLoading,
                id: this.hashId + '-item-' + 0
              },
              this.isLoadingText
            )
          )
        ),
        React.createElement(
          'button',
          {
            'aria-label': 'Clear',
            className: 'clear ' + (this.props.cassClearButton ? this.props.cassClearButton : ''),
            onClick: function onClick() {
              return _this4.clearListOfSelecteds();
            }
          },
          'x'
        )
      );
    }
  }]);

  return MultiSelectAria;
}(React.Component);

MultiSelectAria.propTypes = {
  options: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired
};

export default MultiSelectAria;