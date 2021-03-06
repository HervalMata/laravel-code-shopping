import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {ModalComponent} from "../../../bootstrap/modal/modal.component";
import {ProductHttpService} from "../../../../services/http/product-http.service";
import {Product} from "../../../../model";

@Component({
  selector: 'product-delete-modal',
  templateUrl: './product-delete-modal.component.html',
  styleUrls: ['./product-delete-modal.component.css']
})
export class ProductDeleteModalComponent implements OnInit {
    private _productId: number;
    public product: Product = null;
    public errors = {};

    @Output()
    public onSuccess: EventEmitter<any> = new EventEmitter<any>();
    @Output()
    public onError: EventEmitter<HttpErrorResponse> = new EventEmitter<HttpErrorResponse>();

    @ViewChild(ModalComponent)
    modal: ModalComponent;

    constructor(private productHttp: ProductHttpService) {
    }

    ngOnInit() {

    }

    @Input()
    set productId(value) {
        if (!value) return;

        this._productId = value;
        this.productHttp.get(value).subscribe(response => {
            this.product = response;
        });
    }

    destroy() {
        this.productHttp.destroy(this._productId).subscribe(product => {
            this.modal.hide();
            this.onSuccess.emit(product);
            this.errors = {};
        }, responseError => {
            if (responseError.status === 422) {
                this.errors = responseError.error.errors;
            }

            this.onError.emit(responseError);
        });
    }

    showModal() {
        this.modal.show();
    }

    hideModal($event: Event) {
        console.log($event);
    }

}
