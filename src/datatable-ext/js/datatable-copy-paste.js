doCopy : function() {
			var isSelectionInProgress = this.get(SELECTION_IN_PROGRESS),
				copyContent;

			if (isSelectionInProgress) {
				var data = this.get('data'),
					columns = this.get('columns'),
					selectionRegion = this._computeSelectionRegion(),
					row, col,
					buffer = [],
					model;

				for ( row = selectionRegion.startRow; row <= selectionRegion.endRow; row++) {
					model = data.item(row);
					for ( col = selectionRegion.startCol; col <= selectionRegion.endCol; col++) {
						if (columns[col].editFromNode) {
							buffer.push(this.getCell([row, col]).get('innerHTML'));
						} else {
							buffer.push(model.get(columns[col].key));
						}

						buffer.push('\t');
					}
					buffer.push('\n');
				}

				copyContent = buffer.join('');

			} else {
				copyContent = this.get(ACTIVE_CELL).get('innerHTML');
			}

			this._clipTextArea.set('value', copyContent);
			this._clipTextArea.select();
		},

		doPaste : function(pasteString) {
			var row = this.get(ACTIVE_ROW_INDEX),
				col = this.get(ACTIVE_COL_INDEX),
				data = this.get('data'),
				dataRow,
				recordType = this.get('recordType'),
				dataCol = this.get('columns'),
				dataColLength = dataCol.length,
				count = data.size(),
				lineTokens = pasteString.split('\n'),
				silent = true,
				lastIndex = lineTokens.length - 1;

			if (this.get(SELECTION_IN_PROGRESS)) {

			}

			YArray.each(lineTokens, function(lineToken, index) {
				//Publish change event when we are pasting last item,
				//Better approach would be to call table re-rendering explicitly
				if (index === lastIndex) {
					silent = false;
				}

				tabTokens = lineToken.split('\t');

				var itemData = {};
				YArray.each(tabTokens, function(tabToken, i) {
					var dataColIndex = col + i;
					if (dataColIndex < dataColLength) {
						itemData[dataCol[col + i].key] = tabToken;
					}
				});

				if (row < count && count > 0) {
					dataRow = data.item(row);
					dataRow.setAttrs(itemData);
					row++;
				} else {
					dataRow = new recordType(itemData);
					data.add(dataRow);
				}
			}, this);

			//Since changing any row data causes the Table to re-render, so we need to make sure that
			//currenlty active cell is also synced up
			this._afterSyncUI();
		},