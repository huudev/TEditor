import { NgModule } from '@angular/core';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzEmptyModule } from 'ng-zorro-antd/empty';


@NgModule({
    exports: [
        NzGridModule,
        NzTypographyModule,
        NzLayoutModule,
        NzIconModule,
        NzButtonModule,
        NzBreadCrumbModule,
        NzMenuModule,
        NzPageHeaderModule,
        NzFormModule,
        NzInputModule,
        NzInputNumberModule,
        NzSelectModule,
        NzSliderModule,
        NzSwitchModule,
        NzDescriptionsModule,
        NzTableModule,
        NzDrawerModule,
        NzModalModule,
        NzMessageModule,
        NzPopconfirmModule,
        NzSpinModule,
        NzDividerModule,
        NzEmptyModule,
    ]
})
export class NgZorroAntdModule { }
