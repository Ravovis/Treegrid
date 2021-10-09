import { Component, OnInit, ViewChild } from '@angular/core';
import { sampleData } from './jsontreegriddata';
import * as ej2AngularTreegrid from '@syncfusion/ej2-angular-treegrid';
import { EditSettingsModel, SelectionSettingsModel } from '@syncfusion/ej2-treegrid';
import { MenuEventArgs } from '@syncfusion/ej2-angular-navigations';
import { TreeGridComponent } from '@syncfusion/ej2-angular-treegrid';
import { RowSelectEventArgs } from '@syncfusion/ej2-grids';

interface rowObject {
  level: number,
  uniqueID: string | undefined

  priority: string,
  progress: number,
  duration: number,
  endDate: any,
  startDate: any,
  taskName: any,
  taskId:any
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  providers: [ej2AngularTreegrid.SortService, ej2AngularTreegrid.ResizeService, ej2AngularTreegrid.PageService, ej2AngularTreegrid.EditService, ej2AngularTreegrid.ExcelExportService, ej2AngularTreegrid.PdfExportService, ej2AngularTreegrid.ContextMenuService]

})
export class AppComponent {
  public data: Object[] = [];
  public pageSettings: Object = {};
  public contextMenuItems: any[] = [];
  public editing: EditSettingsModel = {};
  public toolbar: string[] = [];
  public editparams: Object = {};
  public selectionSettings: SelectionSettingsModel = {};
  public selectedRowIndexes: Array<number> | undefined = [];

  @ViewChild('treegrid')
  public treegrid!: TreeGridComponent;
  public multiselect: boolean = false;
  public selectedRecord: Object[] = [];
  public iscut: boolean = false;



  ngOnInit(): void {
    this.data = sampleData;


    this.selectionSettings = { type: 'Single' }

    this.contextMenuItems = [
      {
        text: 'AddNext', target: '.e-content', id: 'addnext'
      },
      {
        text: 'AddChild', target: '.e-content', id: 'addchild'
      },
      {
        text: 'Del', target: '.e-content', id: 'del'
      },
      {
        text: 'Edit', target: '.e-content', id: 'edit'

      },
      {
        text: 'Copy', target: '.e-content', id: 'copy'
      },
      {
        text: 'Cut', target: '.e-content', id: 'cut'
      },
      {
        text: 'Multiselect', target: '.e-content', id: 'multiselect', iconCss: 'e-rectangle-menu-icon e-icons e-rectangle'
      }];

    //this.toolbar = ['Add', 'Edit', 'Delete'];
    this.editing = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: 'Dialog',
      newRowPosition: 'Below'
    };
    this.pageSettings = { pageSize: 10 };
    this.editparams = { params: { format: 'n' } };
  }


  contextMenuClick(args?: MenuEventArgs): void {
    switch (args?.item.id) {
      case 'addnext':
        this.treegrid.addRecord();
        break;


      case 'del':
        this.treegrid.deleteRecord();
        break;



      case 'edit':
        this.treegrid.startEdit();
        break;



      case 'copy':
        this.iscut = false;
        this.selectedRecord = this.treegrid.getSelectedRecords();

        if (this.contextMenuItems.find(x => x.text == 'Paste') == null) {
          this.contextMenuItems.splice(6, 0, {
            text: 'Paste', target: '.e-content', id: 'paste'
          });
          this.contextMenuItems = JSON.parse(JSON.stringify(this.contextMenuItems));
        }
        break;



      case 'cut':
        this.iscut = true;
        this.selectedRecord = this.treegrid.getSelectedRecords();

        if (this.contextMenuItems.find(x => x.text == 'Paste') == null) {
          this.contextMenuItems.splice(6, 0, {
            text: 'Paste', target: '.e-content', id: 'paste'
          });
          this.contextMenuItems = JSON.parse(JSON.stringify(this.contextMenuItems));
        }
        break;

      case 'paste':
        var pasteSelected = this.treegrid.getSelectedRecords()[0] as rowObject;
        var baselevel: number = pasteSelected.level;
        for(var element  of this.selectedRecord as rowObject[])
        {
          var test: rowObject = {
            startDate: element.startDate,
            endDate : element.endDate,
            priority: element.priority,
            progress: element.progress,
            duration: element.duration,
            taskName: element.taskName,
            level: baselevel,
            taskId: 9999,
            uniqueID: undefined
          };
          this.treegrid.addRecord(test);
          console.log(this.treegrid.flatData);
        }
        break;


      case 'multiselect':
        this.multiselect = !this.multiselect;
        if (!this.multiselect) {
          this.contextMenuItems.splice(6, 1, {
            text: 'Multiselect', target: '.e-content', id: 'multiselect', iconCss: 'e-rectangle-menu-icon e-icons e-rectangle'
          });
          this.contextMenuItems = JSON.parse(JSON.stringify(this.contextMenuItems));

          this.selectionSettings = { type: 'Single' };
        }
        else {
          this.contextMenuItems.splice(6, 1, {
            text: 'Multiselect', target: '.e-content', id: 'multiselect', iconCss: 'e-check-menu-icon e-icons e-check'
          });
          this.contextMenuItems = JSON.parse(JSON.stringify(this.contextMenuItems));
          this.selectionSettings = { type: 'Multiple' };
        }
        break;



      default: break;

    }
  }


  public rowSelected(args?: RowSelectEventArgs): void {
    this.selectedRowIndexes = args?.rowIndexes;

    if (this.selectedRowIndexes && this.selectedRowIndexes?.length > 0) {
      /* this.contextMenuItems = [
        { text: 'Copy', target: '.e-content', id: 'copy' },
        { text: 'Cut', target: '.e-content', id: 'cut' },
      ]; */
    } else {
      /* this.contextMenuItems = this.defaultContextMenu; */
    }
  }
}
