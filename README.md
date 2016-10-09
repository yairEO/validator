validator
=========
The javascript validation code is based on jQuery. The Validator is cross-browser and will give you the power to use future-proof input types such as
`tel`, `email`, `number`, `date`, `checkbox` and `url`. I can sum this as a `template` for creating web forms.

In the semantic point-of-view, I believe that this method is very clean and…appropriate. This is how forms should be, IMHO.

# [DEMO PAGE](http://yaireo.github.io/validator)

### Why should you use this?

* Cross browser validation
* Deals with all sorts of edge cases
* Utilize new HTML5 types for unsupported browsers
* Flexible error messaging system
* Light-weight (10kb + comments)

## Validation types support
HTML5 offers a wide selection of input types. I saw no need to support them all, for example, a checkbox should not be validated as ‘required’ because why wouldn’t it be checked in the first place when the form is rendered?

For a full list of all the available Types, visit the working draft page.
These input types can be validated by the the JS for – `<input type='foo' name='bar' />`. (Support is synthesized)

* Text
* Email
* Password
* Number
* Date
* URL
* Search
* File
* Tel
* Checkbox
* Hidden – Hidden fields can also have the ‘required’ attribute

The below form elements are also supported:

* Select – Useing a ‘required’ class because there is no such attribute for ‘select’ element
* Textarea


## Basic semantics
    <form action="" method="post" novalidate>
    	<fieldset>
    		<div class="field">
    			<label>
    				<span>Name</span>
    				<input data-validate-lengthRange="6" data-validate-words="2" name="name" placeholder="ex. John f. Kennedy" required="required" type="text" />
    			</label>
    			<div class='tooltip help'>
    				<span>?</span>
    				<div class='content'>
    					<b></b>
    					<p>Name must be at least 2 words</p>
    				</div>
    			</div>
    		</div>
    		<div class="field">
    			<label>
    				<span>email</span>
    				<input name="email" required="required" type="email" />
    			</label>
    		</div>
         		...


### Explaining the DOM
First, obviously, there is a Form element with the novalidate attribute to make sure to disable the native HTML5 validations (which currently suck). proceeding it there is a Fieldset element which is not a must, but acts as a “binding” box for a group of fields that are under the same “category”. For bigger forms there are many times field groups that are visually separated from each other for example. Now, we treat every form field element the user interacts with, whatsoever, as an “field”, and therefor these “fields” will be wraped with `<div class='field'>`. This isolation gives great powers.
Next, inside an field, there will typically be an input or select or something of the sort, so they are put inside a `<label>` element, to get rid of the (annoying) for attribute, on the label (which also require us to give an ID to the form field element), and now when a user clicks on the label, the field will get focused. great. Going back to the label’s text itself, we wrap it with a `<span>` to have control over it’s style.

The whole approach here is to define each form field (input, select, whatever) as much as possible with HTML5 attributes and also with custom attributes.

| Attribute                  | Purpose                                                                                                                                                                                                                                                                                                                         |
|----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| required                   | Defines that this field should be validated (with JS by my implementation and not via native HTML5 browser defaults)                                                                                                                                                                                                            |
| placeholder                | Writes some placeholder text which usually describes the fields with some example input (not supported in IE8 and below)                                                                                                                                                                                                        |
| pattern                    | Defines a pattern which the field is evaluated with. Available values are:<br>**numeric** - Allow only numbers<br>**alphanumeric** - Allow only numbers or letters. No special language characters<br>**phone** - Allow only numbers, spaces or dashes.<br><br>Alternatively, you may write your own custom regex here as well. |
| data-validate-words        | Defines the minimum amount of words for this field                                                                                                                                                                                                                                                                              |
| data-validate-length       | Defines the length allowed for the field (after trim). Example value: `7,11` (field can only have 7 or 11 characters). you can add how many allowed lengths you wish                                                                                                                                                            |
| data-validate-length-range | Defines the minimum and/or maximum number of chars in the field (after trim). value can be `4,8` for example, or just `4` to set minimum chars only                                                                                                                                                                             |
| data-validate-linked       | Defines the field which the current field’s value (the attribute is set on) should be compared to                                                                                                                                                                                                                               |
| data-validate-minmax       | For type `number` only. Defines the minimum and/or maximum value that can be in that field                                                                                                                                                                                                                                      |




### Optional fields
There is also support for optional fields, which are not validated, unless they have a value. The support for this feature is done by adding a class `optional` to a form element. Note that this should not be done along side the “required” attribute.



## Error messages
This is the object which holds all the texts used by the form validator:

    {
        invalid         : 'inupt is not as expected',
        short           : 'input is too short',
        long            : 'input is too long',
        checked         : 'must be checked',
        empty           : 'please put something here',
        select          : 'Please select an option',
        number_min      : 'too low',
        number_max      : 'too high',
        url             : 'invalid URL',
        number          : 'not a number',
        email           : 'email address is invalid',
        email_repeat    : 'emails do not match',
        date            : 'invalid date',
        password_repeat : 'passwords do not match',
        no_match        : 'no match',
        complete        : 'input is not complete'
    }

This object can be extended easily. The idea is to extend it with new keys which represent the name of the field you want the message to be linked to, and that custom message appear as the `general error` one. Default messages can be over-ride.
Example: for a given type ‘date’ field, lets set a custom (general error) message like so:

    var validator = new FormValidator({ date:'not a real date' });

    // or by doing:
    var validator = new FormValidator();
    validator.texts.date = 'not a real date';

Error messages can be disabled:

    validator = new FormValidator(null, {alerts:false});

    // or by doing:
    var validator = new FormValidator();
    validator.settings.alerts = false;

## Binding the validation to a form

There are two ways to validate form fields, one is on the submit event of the form itself, then all the fields are evaluated one by one.
The other method is by binding the `checkField` function itself to each field, for events like `Blur`, `Change` or whatever event you wish (I prefer on Blur).

###Usage example - validate on submit

A generic callback function using jQuery to have the form validated on the **Submit** event. You can also include your own personal validations before the **checkAll()** call.

    var validator = new FormValidator();
    $('form').submit(function(e){
        var validatorResult = validator.checkAll(this);
        return !!validatorResult.valid;
    });

###Usage example - validate on field blur event (out of focus)
Check every field once it looses focus (onBlur) event

    var validator = new FormValidator();
    $('form').on('blur', 'input[required]', function(){
        validator.checkField.call(validator, this)
    }));

## Tooltips

The helper tooltips **&lt;div class='tooltip help'&gt;**, which work using pure CSS, are element which holds a small **'?'** icon and when hovered over with the mouse, reveals a text explaining what the field “field” is about or for example, what the allowed input format is.

## Classes
`validator.settings.classes` object can be modified:

    var validatorClasses = {
        field : 'field', // class for each input wrapper
        alert : 'alert', // call on the alert tooltip
        bad   : 'bad'    // classes for bad input
    };

    validator = new FormValidator(null, {classes:validatorClasses});

    // or
    validator = new FormValidator();
    validator.settings.classes.bad = 'error';


## Bonus – multifields

I have a cool feature I wrote which I call “multifields”. These are fields which are often use as to input a credit card or a serial number, and are actually a bunch of input fields which are “connected” to each other, and treated as one. You can see it in the demo page, and it’s included in ‘multifield.js’ file.