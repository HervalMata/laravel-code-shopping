import {Component, EventEmitter, Input, Output} from '@angular/core';

/**
 * Generated class for the SelectCountriesCodeComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'select-countries-code',
    templateUrl: 'select-countries-code.html'
})
export class SelectCountriesCodeComponent {
    private _countryCode: string = "1U";
    @Output()
    countryCodeChange: EventEmitter<any> = new EventEmitter<any>();

    constructor() {
    }

    @Input()
    set countryCode(value) {
        this._countryCode = value;
        this.countryCodeChange.emit(value);
    }

    get countryCode() {
        return this._countryCode;
    }
}
