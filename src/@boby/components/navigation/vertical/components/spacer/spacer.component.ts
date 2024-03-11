import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BobyNavigationService } from '@boby/components/navigation/navigation.service';
import { BobyNavigationItem } from '@boby/components/navigation/navigation.types';
import { BobyVerticalNavigationComponent } from '@boby/components/navigation/vertical/vertical.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector       : 'boby-vertical-navigation-spacer-item',
    templateUrl    : './spacer.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [NgClass],
})
export class BobyVerticalNavigationSpacerItemComponent implements OnInit, OnDestroy
{
    @Input() item: BobyNavigationItem;
    @Input() name: string;

    private _bobyVerticalNavigationComponent: BobyVerticalNavigationComponent;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _bobyNavigationService: BobyNavigationService,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Get the parent navigation component
        this._bobyVerticalNavigationComponent = this._bobyNavigationService.getComponent(this.name);

        // Subscribe to onRefreshed on the navigation component
        this._bobyVerticalNavigationComponent.onRefreshed.pipe(
            takeUntil(this._unsubscribeAll),
        ).subscribe(() =>
        {
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
