


/**
 * @interface
 */
qa.business.visitor.IVisitorHolder = function() {};


/**
 * @return {!qa.business.visitor.Visitor}
 */
qa.business.visitor.IVisitorHolder.prototype.getVisitor = function() {};


/**
 * @param {!qa.business.visitor.Visitor} visitor Посетитель.
 */
qa.business.visitor.IVisitorHolder.prototype.setVisitor = function(visitor) {};
