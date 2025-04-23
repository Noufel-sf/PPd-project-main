from django import template

register = template.Library()

@register.filter
def get_role(user):
    try:
        return user.userprofile.role
    except AttributeError:
        return ''