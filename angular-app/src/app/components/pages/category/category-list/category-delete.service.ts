import {Injectable} from "@angular/core";
import {NotifyMessageService} from "../../../../services/notify-message.service";
import {CategoryListComponent} from "./category-list.component";

@Injectable({
    providedIn: 'root'
})
export class CategoryDeleteService {
    private _listComponent: CategoryListComponent;

    constructor(private notifyMessage: NotifyMessageService) {
    }

    set listComponent(value: CategoryListComponent) {
        this._listComponent = value;
    }

    showModal(categoryId: number) {
        this._listComponent.categoryId = categoryId;
        this._listComponent.deleteModal.showModal();
    }

    onError($event) {
        this.notifyMessage.error('Não foi possível remover esta Categoria');
        console.log($event);
    }

    onSuccess($event) {
        this.notifyMessage.success('Categoria apagada com sucesso!');
        this._listComponent.getItems();
    }
}