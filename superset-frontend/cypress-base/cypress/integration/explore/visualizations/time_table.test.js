/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { FORM_DATA_DEFAULTS, NUM_METRIC } from './shared.helper';

describe('Visualization > Time TableViz', () => {
  const VIZ_DEFAULTS = { ...FORM_DATA_DEFAULTS, viz_type: 'time_table' };

  beforeEach(() => {
    cy.login();
    cy.intercept('POST', '/superset/explore_json/**').as('getJson');
  });

  it('Test time series table multiple metrics last year total', () => {
    const formData = {
      ...VIZ_DEFAULTS,
      metrics: [NUM_METRIC, 'count'],
      column_collection: [
        {
          key: '9g4K-B-YL',
          label: 'Last+Year',
          colType: 'time',
          timeLag: '1',
          comparisonType: 'value',
        },
      ],
      url: '',
    };

    cy.visitChartByParams(JSON.stringify(formData));
    cy.verifySliceSuccess({
      waitAlias: '@getJson',
      querySubstring: NUM_METRIC.label,
    });
    cy.get('.time-table').within(() => {
      cy.get('span').contains('Sum(num)');
      cy.get('span').contains('COUNT(*)');
    });
  });
});
