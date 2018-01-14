var budgetController = (function () { //keeps track of income and expenses, the budget and the percentages.

    /* var x = 23; //not accessible to the outside scope

     var add = function (a) { //not accessible to the outside scope
         return x + a;
     }

     return { //By returning an object it gets assigned to the budgetController variable. This is accessible to the outside scope hence we called the method publicTest.
         publicTest: function (b) {
             return add(b); //Because of closures the add function is available to the publicTest method.
         }
     } */

    /////////////////////////////////////////////////////



    //PART 2. ADDING DATA TO budgetController
    //Use function constructors to build the expense and income:

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1; //when something is undefined
    };

    //Calculate Percentage
    Expense.prototype.calcPercent = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.floor((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1
        }

    };

    Expense.prototype.getPercentage = function () {
        return this.percentage
    }

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    //DATA STRUCTURES
    //Store Income & Expenses inputs:
    //Do it this way but better way is to use objects within objects - better data structure.
    /* var allExpenses = [];
     var allIncomes = [];
     var totalExpenses = 0;
     var totalIncomes = 0; */

    var calculateTotal = function (type) {
        var sum = 0;

        data.allItems[type].forEach(function (current) {
            sum += current.value; //The value is a parameter we set in the function constructor
        });

        data.allTotals[type] = sum; //used brackets because the string 'inc' or 'exp is held within a variable type.
    };

    var data = {
        allItems: {
            inc: [], //the properies inc and exp are the same as the values from the HTML (lines 46 & 47 of index.html). This makes it a lot easier to link them dynamically.
            exp: []
        },
        allTotals: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: -1 //use -1 when something doesn't exist. In this case when the income and expense are zero the percentage won't exist.


    };

    return {
        addItem: function (type, des, val) { //what info we want when someone calls this addItem function

            var newItem, ID;
            //CREATE NEW ID
            //To get the next ID we need to look at the array, find the last item and add 1 to it.
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }



            //CREATE NEW ITEM BASED ON TYPE - INC OR EXP


            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            //PUSH INTO OUR DATA STRUCTURE

            data.allItems[type].push(newItem); //calling the data.allItems object and selecting the matching type - which has been determined from the code block above. We put the type within an array because thats what the value of the allItems property is.


            //RETURN THE NEW ELEMENT
            return newItem; //So modules can have access to the newItem value.

        },

        deleteItem: function (type, id) {

            var ids, index, del;

            ids = data.allItems[type].map(function (current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },

        calculateBudget: function () {

            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc')
                //calculate the budget: income - expenses
            data.budget = data.allTotals.inc - data.allTotals.exp;
            //calculate the percentage of income that we spent
            if (data.allTotals.inc > 0) {
                data.percentage = Math.round((data.allTotals.exp / data.allTotals.inc) * 100);
            } else {
                data.percentage = -1;
            }

        },

        calculatePercentages: function () {
            /*
            exp:
            a = 10
            b = 20
            c = 10
            
            If Income was 100 then % of income would be:
            a = 10/100 = 10%
            b = 20/100 = 20%
            c = 10/100 = 10%
            
            */
            data.allItems.exp.forEach(function (cur) {

                cur.calcPercent(data.allTotals.inc);

            })

        },

        getPercentages: function () {
            var allPerc = data.allItems.exp.map(function (cur) {
                return cur.getPercentage();
            });

            return allPerc;
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.allTotals.inc,
                totalExp: data.allTotals.exp,
                percentage: data.percentage
            }
        },

        //Add method to test the data structure is accepting the data.
        test: function () {
            console.log(data)
        }
    };







})();

////////////////////////////////////////////////////////////

var UIController = (function () {



    var DOMString = { //Again making the code more dynamic. By setting up the CSS classes as properties.
        typeDom: '.add__type',
        descriptionDom: '.add__description',
        valueDom: '.add__value',
        btnDom: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        budgetIncomeLabel: '.budget__income--value',
        budgetExpenseLabel: '.budget__expenses--value',
        budgetPercentageLabel: '.budget__expenses--percentage',
        containerDelegation: '.container',
        dateLabel: '.budget__title--month',
        percentageLabel: '.item__percentage'


    }

    var formatNumber = function (num, type) {
        var numSplit, int, dec, sign;
        /*
            
           1. + or - before number
            2. exactly 2 decimal points
            3. comma separating the thousands.
            
            */
        //2.
        num = Math.abs(num); //abs is the absolute method, one of the Math object's. It returns the absolute value so if its negative it will just return the number without the minus sign.

        num = num.toFixed(2); //toFixed works by setting the decimal point. So passing 2 into it will give it two decimal places. It also outputs a string.

        numSplit = num.split('.'); //Remember that the split method outputs in an array. Therefore we can access the parts of the string using the array object.

        //3.
        int = numSplit[0];



        if (int.length > 3) {
            //substr targets parts of the string. In the case below 0 refers to the index and 1 is how many elements we want to choose.
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        dec = numSplit[1];

        type === 'exp' ? sign = '-' : sign = '+'

        return sign + ' ' + int + '.' + dec;
    };

    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i)
        }
    }




    return { //When doing modular programming we always get the function to return so the data it returns is public

        //PART 1 - GETTING INPUT FROM USER

        getInput: function () {
            return {
                type: document.querySelector(DOMString.typeDom).value,
                description: document.querySelector(DOMString.descriptionDom).value,
                value: parseFloat(document.querySelector(DOMString.valueDom).value)
            };
        },
        //part 3. adding data to UI.

        addListItem: function (obj, type) { //where obj is newItem generated by the ctrlAddItem function in the controller module and type is inc or exp.
            var html, newHtml, newElement;
            //CREATE HTML STRING WITH PLACEHOLDER TEXT

            if (type === 'inc') {
                newElement = DOMString.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%des%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"> <i class="ion-ios-close-outline"></i> </button> </div> </div> </div>';

            } else if (type === 'exp') {
                newElement = DOMString.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%des%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }



            //REPLACE PLACEHOLDER TEXT WITH ACTUAL DATA
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%des%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            //INSERT HTML INTO DOM
            document.querySelector(newElement).insertAdjacentHTML('beforeend', newHtml)
        },

        clearFields: function () {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMString.descriptionDom + ',' + DOMString.valueDom);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (cur, i, arr) {
                cur.value = "";
            })

            fieldsArr[0].focus(); //Highlight the first input field by choosing the first element of the array.

        },

        deleteElement: function (idSelect) {
            var el = document.getElementById(idSelect)

            el.parentNode.removeChild(el);
        },

        displayBudget: function (obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMString.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMString.budgetIncomeLabel).textContent = formatNumber(obj.totalInc, 'inc');

            document.querySelector(DOMString.budgetExpenseLabel).textContent = formatNumber(obj.totalExp, 'exp');




            if (obj.percentage > 0) {
                document.querySelector(DOMString.budgetPercentageLabel).textContent = obj.percentage;
            } else {
                document.querySelector(DOMString.budgetPercentageLabel).textContent = '....';
            }
        },

        displayPercentages: function (percentage) {
            var fields = document.querySelectorAll(DOMString.percentageLabel) //returns a node list, not just a list.



            nodeListForEach(fields, function (current, index) {
                if (percentage > 0) {
                    current.textContent = percentage[index] + '%'
                } else {
                    current.textContent = '---';
                }

            })
        },

        currentDate: function () {

            var now, year, month, months, options;
            now = new Date();

            // Could have got the date doing this:
            // month = now.getMonth();
            // year = now.getFullYear();
            // months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            // document.querySelector(DOMString.dateLabel).textContent = months[month] + ',' + year

            options = {
                year: 'numeric',
                month: 'long'
            }

            var upToDate = now.toLocaleDateString('en-GB', options)

            document.querySelector(DOMString.dateLabel).textContent = upToDate


        },

        changedType: function () {
            var fields = document.querySelectorAll(
                DOMString.typeDom + ',' +
                DOMString.descriptionDom + ',' +
                DOMString.valueDom
            );
            nodeListForEach(fields, function (cur) {
                cur.classList.toggle('red-focus')
            })

            document.querySelector(DOMString.btnDom).classList.toggle('red');

        },



        getDom: function () {
            return DOMString;
        }


    };

})();

//////////////////////////////////////////////////////////

//The 2 controllers are completely separate. They don't know each other exists. To connect them we do this:

var controller = (function (budgetCtrl, UICtrl) { //budgetCtrl used here instead of budgetController because if we change the name of the module we only need to change the name below when we invoke the IFFE.

    //Declare Variables.

    var userInput, nextItem;

    //Set up event handlers
    var eventHandlers = function () {
        var modDom = UICtrl.getDom();
        document.querySelector(modDom.btnDom).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }

        });

        document.querySelector(modDom.containerDelegation).addEventListener('click', ctrlDeleteItem);

        document.querySelector(modDom.typeDom).addEventListener('change', UICtrl.changedType)
    }

    var updateBudget = function () {
        //5.Calculate the budget
        budgetCtrl.calculateBudget();
        //6.Return the budget

        var budget = budgetCtrl.getBudget(); //Because we returned a function we have to store it in a variable. IMPORTANT!

        //7.Display the budget on the UI
        UICtrl.displayBudget(budget)
    }

    var updatePercentages = function () {
        //1. Calculate Percentages

        budgetCtrl.calculatePercentages();

        //2. Read thgem from budget controller

        var percentages = budgetCtrl.getPercentages();
        //3.Update the UI with the new percentages
        UICtrl.displayPercentages(percentages)

    };

    var ctrlAddItem = function () {
        //1. Get input from user
        userInput = UICtrl.getInput();
        console.log(userInput)

        if (userInput.description !== "" && !isNaN(userInput.value) && userInput.value > 0) {
            //2.Add item to budget controller
            nextItem = budgetCtrl.addItem(userInput.type, userInput.description, userInput.value)


            //3.Add the item to the UI
            UICtrl.addListItem(nextItem, userInput.type);

            //4.Clear input fields

            UICtrl.clearFields();
            //8.Calculate & update the budget
            updateBudget();

            //9. Calculate and update percentages
            updatePercentages();
        }


    }

    var ctrlDeleteItem = function (event) { //we pass the event object here because we want to know what the target element is.
        var itemID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; //DOM traversal

        if (itemID) {
            var splitId, type, ID;

            splitId = itemID.split('-');
            type = splitId[0];
            ID = parseInt(splitId[1]);
        }



        //Delete the item from the data structure
        budgetCtrl.deleteItem(type, ID)
            //Delete the item from the UI
        UICtrl.deleteElement(itemID)
            //Update budget and show the new budget
        updateBudget();
        //Calculate and update percentages
        updatePercentages();
    }





    return {
        init: function () { //The init function is where we put the code that we want to run first.
            eventHandlers();
            UICtrl.currentDate();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            })
            console.log('App has started')
        }
    }





    /* var z = budgetCtrl.publicTest(5);

    return {
        anotherPublicTest: function () {
        console.log(z)

        }
    } */
})(budgetController, UIController);

controller.init(); //Without this the whole thing wouldn't work.  It is the only piece of code outside of the modules. No event listeners, no input and therefore no data.