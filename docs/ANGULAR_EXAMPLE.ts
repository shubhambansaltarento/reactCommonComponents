// Example: Using Web Components in an Angular app
// Save in your Angular project (e.g., src/app/web-components.component.ts)

import { Component, OnInit } from '@angular/core';
import { registerAllWebComponents } from '@shared/components';

@Component({
  selector: 'app-web-components',
  template: `
    <div class="web-components-demo">
      <h1>Shared Components in Angular</h1>
      <p>Using framework-agnostic Web Components with Angular</p>

      <!-- Simple Button Component -->
      <section>
        <h2>Simple Button</h2>
        <tvs-custom-button
          label="Save Changes"
          variant="contained"
          (click)="handleSave()"
        ></tvs-custom-button>
      </section>

      <!-- Controlled via Component State -->
      <section>
        <h2>Controlled Component</h2>
        <tvs-custom-button
          [attr.label]="'Clicked: ' + clickCount"
          variant="outlined"
          (click)="incrementClick()"
        ></tvs-custom-button>
      </section>

      <!-- Event Handling -->
      <section>
        <h2>Events from Web Components</h2>
        <tvs-custom-button
          label="Trigger Event"
          (click)="handleCustomEvent($event)"
        ></tvs-custom-button>
        <p *ngIf="lastEventDetail">
          Last event detail: {{ lastEventDetail | json }}
        </p>
      </section>

      <!-- Input with Two-Way Binding (through events) -->
      <section>
        <h2>Input Component</h2>
        <tvs-input
          placeholder="Type something..."
          (input)="handleInput($event)"
        ></tvs-input>
        <p *ngIf="inputValue">You typed: {{ inputValue }}</p>
      </section>

      <!-- List Component Example -->
      <section>
        <h2>List Component</h2>
        <p>Items: {{ items | json }}</p>
        <button (click)="updateComponentProps()">
          Update List Props
        </button>
      </section>
    </div>
  `,
  styles: [`
    .web-components-demo {
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    section {
      margin: 20px 0;
      padding: 15px;
      border: 1px solid #eee;
      border-radius: 4px;
    }
    tvs-custom-button {
      margin: 10px 0;
    }
  `],
})
export class WebComponentsComponent implements OnInit {
  clickCount = 0;
  inputValue = '';
  lastEventDetail: any;
  items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
  ];

  ngOnInit() {
    // Register web components when component initializes
    registerAllWebComponents({ prefix: 'tvs' });
  }

  incrementClick() {
    this.clickCount++;
  }

  handleSave() {
    console.log('Save triggered from web component');
  }

  handleCustomEvent(event: Event) {
    const customEvent = event as CustomEvent;
    this.lastEventDetail = customEvent.detail;
    console.log('Custom event captured:', customEvent.detail);
  }

  handleInput(event: Event) {
    const target = event.target as any;
    this.inputValue = target.value;
  }

  updateComponentProps() {
    const listElement = document.querySelector('tvs-common-list') as any;
    if (listElement && listElement.props) {
      listElement.props = {
        items: [
          { id: 1, name: 'Updated Item 1' },
          { id: 2, name: 'Updated Item 2' },
          { id: 3, name: 'New Item 3' },
        ],
      };
    }
  }
}

// app.module.ts - Configure to allow custom elements
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { WebComponentsComponent } from './web-components.component';

@NgModule({
  declarations: [WebComponentsComponent],
  imports: [BrowserModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // ← Allow custom elements
  bootstrap: [AppComponent],
})
export class AppModule {}
